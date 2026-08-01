package com.elixir.service.order.dto;

import com.elixir.service.order.entity.OrderStatus;
import com.elixir.service.order.entity.PaymentMethod;
import com.elixir.service.order.entity.PaymentStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderResponse {

    private String orderNumber;

    private LocalDateTime createdAt;

    private String customerName;

    private String customerPhone;

    private String customerEmail;

    private String deliveryAddress;

    private String deliveryDistrict;

    private String deliveryUpazila;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private OrderStatus orderStatus;

    private Integer priority;

    private BigDecimal subtotal;

    private BigDecimal deliveryCharge;

    private BigDecimal discount;

    private BigDecimal grandTotal;

    private List<OrderItemResponse> items;
}