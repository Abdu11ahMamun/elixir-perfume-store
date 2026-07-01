package com.elixir.service.order.service;

import com.elixir.service.order.entity.Order;
import com.elixir.service.order.entity.OrderItem;

import java.util.List;

public interface OrderItemService {

    // TODO: Replace entity return types with DTOs in DTO phase.
    OrderItem getById(Long id);

    List<OrderItem> getByOrder(Order order);

    OrderItem create(OrderItem orderItem);

    OrderItem update(Long id, OrderItem orderItem);

    void delete(Long id);
}