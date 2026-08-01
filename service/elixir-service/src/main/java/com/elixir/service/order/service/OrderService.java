package com.elixir.service.order.service;

import com.elixir.service.common.dto.PageResponse;
import com.elixir.service.order.dto.OrderCreateRequest;
import com.elixir.service.order.dto.OrderResponse;
import com.elixir.service.order.dto.OrderUpdateRequest;
import com.elixir.service.order.entity.OrderStatus;
import com.elixir.service.order.entity.PaymentStatus;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    OrderResponse placeOrder(OrderCreateRequest request);

    OrderResponse getByOrderNumber(String orderNumber);

    PageResponse<OrderResponse> getAdminOrders(
            OrderStatus orderStatus,
            PaymentStatus paymentStatus,
            String customerPhone,
            Pageable pageable
    );

    OrderResponse updateOrderStatus(String orderNumber, OrderStatus status);

    OrderResponse updatePaymentStatus(String orderNumber, PaymentStatus status);

    OrderResponse updateOrderDetails(String orderNumber, OrderUpdateRequest request);
}