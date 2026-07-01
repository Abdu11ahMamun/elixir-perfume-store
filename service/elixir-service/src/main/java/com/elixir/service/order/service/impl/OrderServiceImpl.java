package com.elixir.service.order.service.impl;

import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.order.entity.Order;
import com.elixir.service.order.repository.OrderRepository;
import com.elixir.service.order.service.OrderService;
import com.elixir.service.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Order getByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getByCustomer(User customer) {
        return orderRepository.findByCustomer(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getByCustomerPhone(String customerPhone) {
        return orderRepository.findByCustomerPhone(customerPhone);
    }

    @Override
    @Transactional
    public Order create(Order order) {
        if (orderRepository.findByOrderNumber(order.getOrderNumber()).isPresent()) {
            throw new DuplicateResourceException("Order number already exists");
        }

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order update(Long id, Order order) {
        Order existing = getById(id);

        existing.setCustomer(order.getCustomer());
        existing.setCustomerName(order.getCustomerName());
        existing.setCustomerPhone(order.getCustomerPhone());
        existing.setCustomerEmail(order.getCustomerEmail());
        existing.setDeliveryAddress(order.getDeliveryAddress());
        existing.setPaymentMethod(order.getPaymentMethod());
        existing.setPaymentStatus(order.getPaymentStatus());
        existing.setOrderStatus(order.getOrderStatus());
        existing.setPriority(order.getPriority());
        existing.setSubtotal(order.getSubtotal());
        existing.setDeliveryCharge(order.getDeliveryCharge());
        existing.setDiscount(order.getDiscount());
        existing.setGrandTotal(order.getGrandTotal());

        return orderRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Order existing = getById(id);
        existing.setDeletedAt(LocalDateTime.now());
        orderRepository.save(existing);
    }
}