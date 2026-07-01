package com.elixir.service.order.service;

import com.elixir.service.order.dto.OrderItemCreateRequest;
import com.elixir.service.order.dto.OrderItemResponse;
import com.elixir.service.order.dto.OrderItemUpdateRequest;

import java.util.List;

public interface OrderItemService {

    OrderItemResponse getById(Long id);

    List<OrderItemResponse> getByOrderId(Long orderId);

    OrderItemResponse create(OrderItemCreateRequest request);

    OrderItemResponse update(Long id, OrderItemUpdateRequest request);

    void delete(Long id);
}