package com.elixir.service.order.service.impl;

import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.order.dto.OrderItemCreateRequest;
import com.elixir.service.order.dto.OrderItemResponse;
import com.elixir.service.order.dto.OrderItemUpdateRequest;
import com.elixir.service.order.entity.Order;
import com.elixir.service.order.entity.OrderItem;
import com.elixir.service.order.repository.OrderItemRepository;
import com.elixir.service.order.repository.OrderRepository;
import com.elixir.service.order.service.OrderItemService;
import com.elixir.service.product.entity.ProductSize;
import com.elixir.service.product.repository.ProductSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductSizeRepository productSizeRepository;

    @Override
    @Transactional(readOnly = true)
    public OrderItemResponse getById(Long id) {
        OrderItem orderItem = findOrderItemById(id);
        return toResponse(orderItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderItemResponse> getByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return orderItemRepository.findByOrder(order)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderItemResponse create(OrderItemCreateRequest request) {
        // TODO: Standalone order item creation is not part of public order placement flow.
        // TODO: This service method should be redesigned or removed in a future admin/order management phase.
        // Public order placement creates order items inside OrderService.placeOrder().

        ProductSize productSize = productSizeRepository.findById(request.getProductSizeId())
                .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));

        OrderItem orderItem = new OrderItem();
        orderItem.setProductSize(productSize);
        orderItem.setProductNameSnapshot(
                productSize.getProduct() != null ? productSize.getProduct().getName() : null
        );
        orderItem.setSelectedMlSnapshot(productSize.getMl());
        orderItem.setUnitPrice(productSize.getPrice());
        orderItem.setQuantity(request.getQuantity());
        orderItem.setLineTotal(productSize.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));

        OrderItem saved = orderItemRepository.save(orderItem);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public OrderItemResponse update(Long id, OrderItemUpdateRequest request) {
        OrderItem existing = findOrderItemById(id);

        if (request.getProductNameSnapshot() != null) {
            existing.setProductNameSnapshot(request.getProductNameSnapshot());
        }

        if (request.getSelectedMlSnapshot() != null) {
            existing.setSelectedMlSnapshot(request.getSelectedMlSnapshot());
        }

        if (request.getUnitPrice() != null) {
            existing.setUnitPrice(request.getUnitPrice());
        }

        if (request.getQuantity() != null) {
            existing.setQuantity(request.getQuantity());
        }

        if (request.getLineTotal() != null) {
            existing.setLineTotal(request.getLineTotal());
        }

        OrderItem saved = orderItemRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        OrderItem existing = findOrderItemById(id);
        existing.setDeletedAt(LocalDateTime.now());
        orderItemRepository.save(existing);
    }

    private OrderItem findOrderItemById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));
    }

    private OrderItemResponse toResponse(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();

        response.setId(orderItem.getId());
        response.setProductSizeId(orderItem.getProductSize() != null ? orderItem.getProductSize().getId() : null);
        response.setProductNameSnapshot(orderItem.getProductNameSnapshot());
        response.setSelectedMlSnapshot(orderItem.getSelectedMlSnapshot());
        response.setUnitPrice(orderItem.getUnitPrice());
        response.setQuantity(orderItem.getQuantity());
        response.setLineTotal(orderItem.getLineTotal());

        return response;
    }
}