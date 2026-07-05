package com.elixir.service.order.dto;

import com.elixir.service.order.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PaymentStatusUpdateRequest {

    @NotNull
    private PaymentStatus paymentStatus;
}