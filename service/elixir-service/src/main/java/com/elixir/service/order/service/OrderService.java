package com.elixir.service.order.service;

import com.elixir.service.order.dto.OrderCreateRequest;
import com.elixir.service.order.dto.OrderResponse;

public interface OrderService {

    OrderResponse placeOrder(OrderCreateRequest request);

    OrderResponse getByOrderNumber(String orderNumber);
}