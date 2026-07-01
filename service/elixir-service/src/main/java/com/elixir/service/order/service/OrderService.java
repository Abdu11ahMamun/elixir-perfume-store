package com.elixir.service.order.service;

import com.elixir.service.order.entity.Order;
import com.elixir.service.user.entity.User;

import java.util.List;

public interface OrderService {

    // TODO: Replace entity return types with DTOs in DTO phase.
    Order getById(Long id);

    Order getByOrderNumber(String orderNumber);

    List<Order> getByCustomer(User customer);

    List<Order> getByCustomerPhone(String customerPhone);

    Order create(Order order);

    Order update(Long id, Order order);

    void delete(Long id);
}