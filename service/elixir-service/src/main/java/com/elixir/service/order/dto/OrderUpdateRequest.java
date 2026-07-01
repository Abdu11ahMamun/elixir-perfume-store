package com.elixir.service.order.dto;

import com.elixir.service.order.entity.OrderStatus;
import com.elixir.service.order.entity.PaymentMethod;
import com.elixir.service.order.entity.PaymentStatus;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class OrderUpdateRequest {
    @Size(max = 120)
    private String customerName;

    @Size(max = 20)
    private String customerPhone;

    @Size(max = 150)
    private String customerEmail;

    private String deliveryAddress;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private Integer priority;

    @PositiveOrZero
    private BigDecimal subtotal;

    @PositiveOrZero
    private BigDecimal deliveryCharge;

    @PositiveOrZero
    private BigDecimal discount;

    @PositiveOrZero
    private BigDecimal grandTotal;
}
