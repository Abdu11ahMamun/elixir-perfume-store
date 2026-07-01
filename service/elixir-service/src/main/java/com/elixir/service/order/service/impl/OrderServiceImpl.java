package com.elixir.service.order.service.impl;

import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.order.dto.OrderCreateRequest;
import com.elixir.service.order.dto.OrderResponse;
import com.elixir.service.order.dto.OrderUpdateRequest;
import com.elixir.service.order.entity.Order;
import com.elixir.service.order.repository.OrderRepository;
import com.elixir.service.order.service.OrderService;
import com.elixir.service.user.entity.User;
import com.elixir.service.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getByCustomerId(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByCustomer(customer).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getByCustomerPhone(String customerPhone) {
        return orderRepository.findByCustomerPhone(customerPhone).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public OrderResponse create(OrderCreateRequest request) {
        if (orderRepository.findByOrderNumber(request.getOrderNumber()).isPresent()) {
            throw new DuplicateResourceException("Order number already exists");
        }

        Order order = new Order();
        order.setOrderNumber(request.getOrderNumber());

        if (request.getCustomerId() != null) {
            User customer = userRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            order.setCustomer(customer);
        }

        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(request.getPaymentStatus());
        order.setOrderStatus(request.getOrderStatus());
        order.setPriority(request.getPriority());
        order.setSubtotal(request.getSubtotal());
        order.setDeliveryCharge(request.getDeliveryCharge());
        order.setDiscount(request.getDiscount());
        order.setGrandTotal(request.getGrandTotal());

        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public OrderResponse update(Long id, OrderUpdateRequest request) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        existing.setCustomerName(request.getCustomerName());
        existing.setCustomerPhone(request.getCustomerPhone());
        existing.setCustomerEmail(request.getCustomerEmail());
        existing.setDeliveryAddress(request.getDeliveryAddress());
        existing.setPaymentMethod(request.getPaymentMethod());
        existing.setPaymentStatus(request.getPaymentStatus());
        existing.setOrderStatus(request.getOrderStatus());
        existing.setPriority(request.getPriority());
        existing.setSubtotal(request.getSubtotal());
        existing.setDeliveryCharge(request.getDeliveryCharge());
        existing.setDiscount(request.getDiscount());
        existing.setGrandTotal(request.getGrandTotal());

        Order saved = orderRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        existing.setDeletedAt(LocalDateTime.now());
        orderRepository.save(existing);
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerId(order.getCustomer() != null ? order.getCustomer().getId() : null);
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
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        return response;
    }
}