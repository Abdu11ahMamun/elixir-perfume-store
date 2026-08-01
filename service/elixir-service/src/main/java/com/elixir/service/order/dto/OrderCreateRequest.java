package com.elixir.service.order.dto;

import com.elixir.service.order.entity.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderCreateRequest {

    @NotBlank
    @Size(max = 120)
    private String customerName;

    @NotBlank
    @Size(max = 20)
    private String customerPhone;

    @Email
    @Size(max = 150)
    private String customerEmail;

    @NotBlank
    private String deliveryAddress;

    @NotBlank
    @Size(max = 100)
    private String deliveryDistrict;

    @Size(max = 100)
    private String deliveryUpazila;

    @NotNull
    private PaymentMethod paymentMethod;

    @Valid
    @NotEmpty
    private List<OrderItemCreateRequest> items;
}