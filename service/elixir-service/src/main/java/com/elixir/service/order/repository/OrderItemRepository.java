package com.elixir.service.order.repository;

import com.elixir.service.order.entity.Order;
import com.elixir.service.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);
}