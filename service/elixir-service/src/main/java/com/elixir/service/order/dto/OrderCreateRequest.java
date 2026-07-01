package com.elixir.service.order.dto;

import com.elixir.service.order.entity.OrderStatus;
import com.elixir.service.order.entity.PaymentMethod;
import com.elixir.service.order.entity.PaymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class OrderCreateRequest {
    @NotBlank
    @Size(max = 30)
    private String orderNumber;

    private Long customerId;

    @NotBlank
    @Size(max = 120)
    private String customerName;

    @NotBlank
    @Size(max = 20)
    private String customerPhone;

    @Size(max = 150)
    private String customerEmail;

    @NotBlank
    private String deliveryAddress;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    private PaymentStatus paymentStatus;

    @NotNull
    private OrderStatus orderStatus;

    @NotNull
    private Integer priority;

    @NotNull
    @PositiveOrZero
    private BigDecimal subtotal;

    @NotNull
    @PositiveOrZero
    private BigDecimal deliveryCharge;

    @NotNull
    @PositiveOrZero
    private BigDecimal discount;

    @NotNull
    @PositiveOrZero
    private BigDecimal grandTotal;
}
