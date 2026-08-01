package com.elixir.service.order.service.impl;

import com.elixir.service.common.exception.BusinessValidationException;
import com.elixir.service.common.exception.InsufficientStockException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.customer.entity.Customer;
import com.elixir.service.customer.service.CustomerService;
import com.elixir.service.delivery.entity.DeliveryArea;
import com.elixir.service.delivery.repository.DeliveryAreaRepository;
import com.elixir.service.order.dto.OrderCreateRequest;
import com.elixir.service.order.dto.OrderItemCreateRequest;
import com.elixir.service.order.dto.OrderItemResponse;
import com.elixir.service.order.dto.OrderResponse;
import com.elixir.service.order.dto.OrderUpdateRequest;
import com.elixir.service.order.entity.Order;
import com.elixir.service.order.entity.OrderItem;
import com.elixir.service.order.entity.OrderStatus;
import com.elixir.service.order.entity.PaymentStatus;
import com.elixir.service.order.repository.OrderItemRepository;
import com.elixir.service.order.repository.OrderRepository;
import com.elixir.service.order.service.OrderService;
import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductSize;
import com.elixir.service.product.entity.ProductStatus;
import com.elixir.service.product.repository.ProductSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.elixir.service.common.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final DateTimeFormatter ORDER_NUMBER_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");

    // Allowed next-status moves. DELIVERED is intentionally still reachable
    // here (it stays a valid, meaningful terminal state for the data model
    // and for the "Delivered" stats query) — the admin panel just no longer
    // exposes it as a selectable choice in its status editor.
    private static final Map<OrderStatus, Set<OrderStatus>> ORDER_STATUS_TRANSITIONS = Map.of(
            OrderStatus.PENDING,    Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
            OrderStatus.CONFIRMED,  Set.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED),
            OrderStatus.PROCESSING, Set.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
            OrderStatus.SHIPPED,    Set.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED),
            OrderStatus.DELIVERED,  Set.of(),
            OrderStatus.CANCELLED,  Set.of()
    );

    private static final Map<PaymentStatus, Set<PaymentStatus>> PAYMENT_STATUS_TRANSITIONS = Map.of(
            PaymentStatus.UNPAID,   Set.of(PaymentStatus.PAID, PaymentStatus.FAILED),
            PaymentStatus.PAID,     Set.of(PaymentStatus.REFUNDED),
            PaymentStatus.FAILED,   Set.of(PaymentStatus.UNPAID, PaymentStatus.PAID),
            PaymentStatus.REFUNDED, Set.of()
    );

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductSizeRepository productSizeRepository;
    private final DeliveryAreaRepository deliveryAreaRepository;
    private final CustomerService customerService;

    @Override
    @Transactional
    public OrderResponse placeOrder(OrderCreateRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BusinessValidationException("Order must contain at least one item");
        }

        // Resolve the delivery area (and therefore the charge) server-side,
        // before touching stock — a frontend-submitted charge is never
        // trusted. Fails fast if the location isn't deliverable.
        DeliveryArea deliveryArea = resolveDeliveryArea(request.getDeliveryDistrict(), request.getDeliveryUpazila());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        Integer priority = null;

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomer(null);
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setDeliveryAddress(request.getDeliveryAddress());
        // Snapshot what the customer actually selected — not necessarily the
        // same as deliveryArea's own upazila, which may be null if charge
        // resolution fell back to a district-wide rate.
        order.setDeliveryDistrict(request.getDeliveryDistrict().trim());
        order.setDeliveryUpazila(request.getDeliveryUpazila() == null || request.getDeliveryUpazila().isBlank()
                ? null : request.getDeliveryUpazila().trim());
        order.setDeliveryArea(deliveryArea);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setOrderStatus(OrderStatus.PENDING);

        Map<Long, Integer> requiredQuantitiesBySize = new LinkedHashMap<>();
        for (OrderItemCreateRequest itemRequest : request.getItems()) {
            requiredQuantitiesBySize.merge(
                    itemRequest.getProductSizeId(),
                    itemRequest.getQuantity(),
                    Integer::sum
            );
        }

        Map<Long, ProductSize> lockedProductSizes = new LinkedHashMap<>();
        for (Map.Entry<Long, Integer> entry : requiredQuantitiesBySize.entrySet()) {
            Long productSizeId = entry.getKey();
            int requiredQuantity = entry.getValue();

            ProductSize productSize = productSizeRepository.findByIdAndDeletedAtIsNull(productSizeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));

            validateProductSizeForPublicOrder(productSize);

            if (productSize.getStock() == null || productSize.getStock() < requiredQuantity) {
                throw new InsufficientStockException("Insufficient stock for product size: " + productSize.getSku());
            }

            productSize.setStock(productSize.getStock() - requiredQuantity);
            productSizeRepository.save(productSize);

            lockedProductSizes.put(productSizeId, productSize);
        }

        for (OrderItemCreateRequest itemRequest : request.getItems()) {
            ProductSize productSize = lockedProductSizes.get(itemRequest.getProductSizeId());
            Product product = productSize.getProduct();

            BigDecimal unitPrice = productSize.getPrice();
            BigDecimal quantity = BigDecimal.valueOf(itemRequest.getQuantity());
            BigDecimal lineTotal = unitPrice.multiply(quantity);

            subtotal = subtotal.add(lineTotal);

            int itemPriority = resolvePriority(productSize.getMl());
            priority = priority == null ? itemPriority : Math.min(priority, itemPriority);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductSize(productSize);
            orderItem.setProductNameSnapshot(product.getName());
            orderItem.setSelectedMlSnapshot(productSize.getMl());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setLineTotal(lineTotal);

            orderItems.add(orderItem);
        }

        // Charge is the one resolved server-side from the delivery area
        // above — never the client's own submission, and preserved exactly
        // as applied even if the area's rate changes later.
        BigDecimal deliveryCharge = deliveryArea.getCharge();
        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal.add(deliveryCharge).subtract(discount);

        order.setPriority(priority);
        order.setSubtotal(subtotal);
        order.setDeliveryCharge(deliveryCharge);
        order.setDiscount(discount);
        order.setGrandTotal(grandTotal);

        // Find-or-create the customer this order belongs to (by phone) and
        // link it — see CustomerServiceImpl for the upsert/concurrency
        // handling and what "update missing/current details" means here.
        Customer customer = customerService.recordOrder(order);
        order.setCustomerRef(customer);

        Order savedOrder = orderRepository.save(order);
        List<OrderItem> savedItems = orderItemRepository.saveAll(orderItems);

        return toResponse(savedOrder, savedItems);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .filter(existing -> existing.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        List<OrderItem> items = orderItemRepository.findByOrder(order);

        return toResponse(order, items);
    }

    /**
     * Resolves the active delivery area for a district/upazila pair — an
     * exact upazila match if one exists, otherwise the district-wide entry.
     * Mirrors DeliveryAreaServiceImpl's identical resolution logic; kept as
     * its own lookup here rather than a cross-service call, consistent with
     * how this class already reaches into other domains' repositories
     * directly (e.g. ProductSizeRepository) instead of through their
     * service interfaces.
     */
    private DeliveryArea resolveDeliveryArea(String district, String upazila) {
        if (district == null || district.isBlank()) {
            throw new BusinessValidationException("Delivery district is required");
        }
        String trimmedDistrict = district.trim();
        String normalizedUpazila = (upazila == null || upazila.isBlank()) ? null : upazila.trim();

        if (normalizedUpazila != null) {
            var exact = deliveryAreaRepository.findByDistrictAndUpazilaAndActiveTrueAndDeletedAtIsNull(trimmedDistrict, normalizedUpazila);
            if (exact.isPresent()) {
                return exact.get();
            }
        }

        return deliveryAreaRepository.findByDistrictAndUpazilaIsNullAndActiveTrueAndDeletedAtIsNull(trimmedDistrict)
                .orElseThrow(() -> new BusinessValidationException("Delivery is not available for the selected location"));
    }

    private void validateProductSizeForPublicOrder(ProductSize productSize) {
        if (!Boolean.TRUE.equals(productSize.getActive()) || productSize.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Product size not found");
        }

        Product product = productSize.getProduct();

        if (product == null
                || product.getDeletedAt() != null
                || !ProductStatus.ACTIVE.equals(product.getStatus())) {
            throw new ResourceNotFoundException("Product not found");
        }
    }

    private Integer resolvePriority(Integer ml) {
        if (Integer.valueOf(30).equals(ml)) {
            return 1;
        }

        if (Integer.valueOf(15).equals(ml)) {
            return 2;
        }

        if (Integer.valueOf(6).equals(ml)) {
            return 3;
        }

        throw new BusinessValidationException("Invalid product size");
    }

    private String generateOrderNumber() {
        // TODO: Replace with Redis INCR-based ml-priority order number generator.
        return "ELX-" + LocalDateTime.now().format(ORDER_NUMBER_FORMAT) + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private OrderResponse toResponse(Order order, List<OrderItem> items) {
        OrderResponse response = new OrderResponse();

        response.setOrderNumber(order.getOrderNumber());
        response.setCreatedAt(order.getCreatedAt());
        response.setCustomerName(order.getCustomerName());
        response.setCustomerPhone(order.getCustomerPhone());
        response.setCustomerEmail(order.getCustomerEmail());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setDeliveryDistrict(order.getDeliveryDistrict());
        response.setDeliveryUpazila(order.getDeliveryUpazila());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setOrderStatus(order.getOrderStatus());
        response.setPriority(order.getPriority());
        response.setSubtotal(order.getSubtotal());
        response.setDeliveryCharge(order.getDeliveryCharge());
        response.setDiscount(order.getDiscount());
        response.setGrandTotal(order.getGrandTotal());
        response.setItems(items.stream().map(this::toItemResponse).toList());

        return response;
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();

        response.setId(item.getId());
        response.setProductSizeId(item.getProductSize() != null ? item.getProductSize().getId() : null);
        response.setProductNameSnapshot(item.getProductNameSnapshot());
        response.setSelectedMlSnapshot(item.getSelectedMlSnapshot());
        response.setUnitPrice(item.getUnitPrice());
        response.setQuantity(item.getQuantity());
        response.setLineTotal(item.getLineTotal());

        return response;
    }
    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAdminOrders(
            OrderStatus orderStatus,
            PaymentStatus paymentStatus,
            String customerPhone,
            Pageable pageable
    ) {
        // TODO: Implement dynamic filtering in a future phase using architect-approved repository strategy.
        // Current phase keeps repository unchanged and returns paginated non-deleted orders.

        List<Order> allOrders = orderRepository.findAll()
                .stream()
                .filter(order -> order.getDeletedAt() == null)
                .filter(order -> orderStatus == null || orderStatus.equals(order.getOrderStatus()))
                .filter(order -> paymentStatus == null || paymentStatus.equals(order.getPaymentStatus()))
                .filter(order -> customerPhone == null || customerPhone.isBlank() || customerPhone.equals(order.getCustomerPhone()))
                .toList();

        List<OrderResponse> responses = allOrders.stream()
                .map(order -> toResponse(order, orderItemRepository.findByOrder(order)))
                .toList();

        Page<OrderResponse> page = toPage(responses, pageable);

        return PageResponse.fromPage(page, pageable.getSort().toString());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(String orderNumber, OrderStatus status) {
        Order order = findOrderByOrderNumber(orderNumber);
        OrderStatus current = order.getOrderStatus();

        if (current != status && !ORDER_STATUS_TRANSITIONS.getOrDefault(current, Set.of()).contains(status)) {
            throw new BusinessValidationException(
                    "Cannot change order status from " + current + " to " + status);
        }

        order.setOrderStatus(status);

        Order saved = orderRepository.save(order);
        List<OrderItem> items = orderItemRepository.findByOrder(saved);

        // A status change can move a customer between active/inactive
        // (client rule: active while any order is non-terminal) — recompute
        // from their full order history, not just this one order.
        customerService.refreshActivityStatus(saved);

        return toResponse(saved, items);
    }

    @Override
    @Transactional
    public OrderResponse updatePaymentStatus(String orderNumber, PaymentStatus status) {
        Order order = findOrderByOrderNumber(orderNumber);
        PaymentStatus current = order.getPaymentStatus();

        if (current != status && !PAYMENT_STATUS_TRANSITIONS.getOrDefault(current, Set.of()).contains(status)) {
            throw new BusinessValidationException(
                    "Cannot change payment status from " + current + " to " + status);
        }

        order.setPaymentStatus(status);

        Order saved = orderRepository.save(order);
        List<OrderItem> items = orderItemRepository.findByOrder(saved);

        return toResponse(saved, items);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderDetails(String orderNumber, OrderUpdateRequest request) {
        Order order = findOrderByOrderNumber(orderNumber);

        // Only buyer/contact and delivery-address fields are editable through
        // this endpoint. Status fields go through their own validated
        // endpoints above, and financial fields (subtotal/deliveryCharge/
        // discount/grandTotal/priority) are intentionally never applied here
        // even if present on the request — they're computed at order time
        // and out of scope for admin editing.
        if (request.getCustomerName() != null) {
            order.setCustomerName(request.getCustomerName());
        }
        if (request.getCustomerPhone() != null) {
            order.setCustomerPhone(request.getCustomerPhone());
        }
        if (request.getCustomerEmail() != null) {
            order.setCustomerEmail(request.getCustomerEmail());
        }
        if (request.getDeliveryAddress() != null) {
            order.setDeliveryAddress(request.getDeliveryAddress());
        }

        Order saved = orderRepository.save(order);
        List<OrderItem> items = orderItemRepository.findByOrder(saved);

        return toResponse(saved, items);
    }

    private Order findOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .filter(order -> order.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private Page<OrderResponse> toPage(List<OrderResponse> orders, Pageable pageable) {
        int start = (int) pageable.getOffset();

        if (start >= orders.size()) {
            return new PageImpl<>(List.of(), pageable, orders.size());
        }

        int end = Math.min(start + pageable.getPageSize(), orders.size());

        return new PageImpl<>(
                orders.subList(start, end),
                pageable,
                orders.size()
        );
    }
}