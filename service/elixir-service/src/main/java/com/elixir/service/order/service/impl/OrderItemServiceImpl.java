package com.elixir.service.order.service.impl;

import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.order.dto.OrderItemCreateRequest;
import com.elixir.service.order.dto.OrderItemResponse;
import com.elixir.service.order.dto.OrderItemUpdateRequest;
import com.elixir.service.order.entity.Order;
import com.elixir.service.order.entity.OrderItem;
import com.elixir.service.order.repository.OrderItemRepository;
import com.elixir.service.order.repository.OrderRepository;
import com.elixir.service.product.entity.ProductSize;
import com.elixir.service.product.repository.ProductSizeRepository;
import com.elixir.service.order.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));
        return toResponse(orderItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderItemResponse> getByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return orderItemRepository.findByOrder(order).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public OrderItemResponse create(OrderItemCreateRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        ProductSize productSize = productSizeRepository.findById(request.getProductSizeId())
                .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProductSize(productSize);
        orderItem.setProductNameSnapshot(request.getProductNameSnapshot());
        orderItem.setSelectedMlSnapshot(request.getSelectedMlSnapshot());
        orderItem.setUnitPrice(request.getUnitPrice());
        orderItem.setQuantity(request.getQuantity());
        orderItem.setLineTotal(request.getLineTotal());

        OrderItem saved = orderItemRepository.save(orderItem);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public OrderItemResponse update(Long id, OrderItemUpdateRequest request) {
        OrderItem existing = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));

        existing.setProductNameSnapshot(request.getProductNameSnapshot());
        existing.setSelectedMlSnapshot(request.getSelectedMlSnapshot());
        existing.setUnitPrice(request.getUnitPrice());
        existing.setQuantity(request.getQuantity());
        existing.setLineTotal(request.getLineTotal());

        OrderItem saved = orderItemRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        OrderItem existing = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));
        existing.setDeletedAt(LocalDateTime.now());
        orderItemRepository.save(existing);
    }

    private OrderItemResponse toResponse(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(orderItem.getId());
        response.setOrderId(orderItem.getOrder() != null ? orderItem.getOrder().getId() : null);
        response.setProductSizeId(orderItem.getProductSize() != null ? orderItem.getProductSize().getId() : null);
        response.setProductNameSnapshot(orderItem.getProductNameSnapshot());
        response.setSelectedMlSnapshot(orderItem.getSelectedMlSnapshot());
        response.setUnitPrice(orderItem.getUnitPrice());
        response.setQuantity(orderItem.getQuantity());
        response.setLineTotal(orderItem.getLineTotal());
        response.setCreatedAt(orderItem.getCreatedAt());
        response.setUpdatedAt(orderItem.getUpdatedAt());
        return response;
    }
}