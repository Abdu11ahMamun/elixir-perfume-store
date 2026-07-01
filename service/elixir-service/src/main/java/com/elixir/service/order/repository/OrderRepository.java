package com.elixir.service.order.repository;

import com.elixir.service.order.entity.Order;
import com.elixir.service.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

	Optional<Order> findByOrderNumber(String orderNumber);

	List<Order> findByCustomer(User customer);

	List<Order> findByCustomerPhone(String customerPhone);
}
