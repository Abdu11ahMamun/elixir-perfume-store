package com.elixir.service.order.service.impl;

import com.elixir.service.common.exception.BusinessValidationException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.order.dto.OrderCreateRequest;
import com.elixir.service.order.dto.OrderItemCreateRequest;
import com.elixir.service.order.dto.OrderItemResponse;
import com.elixir.service.order.dto.OrderResponse;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final DateTimeFormatter ORDER_NUMBER_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductSizeRepository productSizeRepository;

    @Override
    @Transactional
    public OrderResponse placeOrder(OrderCreateRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BusinessValidationException("Order must contain at least one item");
        }

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
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setOrderStatus(OrderStatus.PENDING);

        for (OrderItemCreateRequest itemRequest : request.getItems()) {
            ProductSize productSize = productSizeRepository.findById(itemRequest.getProductSizeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));

            validateProductSizeForPublicOrder(productSize);

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

            // TODO: Deduct stock in inventory phase.
        }

        BigDecimal deliveryCharge = BigDecimal.ZERO;
        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal.add(deliveryCharge).subtract(discount);

        order.setPriority(priority);
        order.setSubtotal(subtotal);
        order.setDeliveryCharge(deliveryCharge);
        order.setDiscount(discount);
        order.setGrandTotal(grandTotal);

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
        response.setCustomerName(order.getCustomerName());
        response.setCustomerPhone(order.getCustomerPhone());
        response.setCustomerEmail(order.getCustomerEmail());
        response.setDeliveryAddress(order.getDeliveryAddress());
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
}