package com.elixir.service.order.service.impl;

import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.order.entity.Order;
import com.elixir.service.order.entity.OrderItem;
import com.elixir.service.order.repository.OrderItemRepository;
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

    @Override
    @Transactional(readOnly = true)
    public OrderItem getById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderItem> getByOrder(Order order) {
        return orderItemRepository.findByOrder(order);
    }

    @Override
    @Transactional
    public OrderItem create(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    @Override
    @Transactional
    public OrderItem update(Long id, OrderItem orderItem) {
        OrderItem existing = getById(id);

        existing.setOrder(orderItem.getOrder());
        existing.setProductSize(orderItem.getProductSize());
        existing.setProductNameSnapshot(orderItem.getProductNameSnapshot());
        existing.setSelectedMlSnapshot(orderItem.getSelectedMlSnapshot());
        existing.setUnitPrice(orderItem.getUnitPrice());
        existing.setQuantity(orderItem.getQuantity());
        existing.setLineTotal(orderItem.getLineTotal());

        return orderItemRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        OrderItem existing = getById(id);
        existing.setDeletedAt(LocalDateTime.now());
        orderItemRepository.save(existing);
    }
}