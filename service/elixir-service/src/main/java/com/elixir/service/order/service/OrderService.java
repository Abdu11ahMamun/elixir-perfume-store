package com.elixir.service.order.service;

import com.elixir.service.order.dto.OrderCreateRequest;
import com.elixir.service.order.dto.OrderResponse;
import com.elixir.service.order.dto.OrderUpdateRequest;

import java.util.List;

public interface OrderService {

    OrderResponse getById(Long id);

    OrderResponse getByOrderNumber(String orderNumber);

    List<OrderResponse> getByCustomerId(Long customerId);

    List<OrderResponse> getByCustomerPhone(String customerPhone);

    OrderResponse create(OrderCreateRequest request);

    OrderResponse update(Long id, OrderUpdateRequest request);

    void delete(Long id);
}