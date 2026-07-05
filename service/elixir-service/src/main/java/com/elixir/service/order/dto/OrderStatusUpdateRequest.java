package com.elixir.service.order.dto;

import com.elixir.service.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderStatusUpdateRequest {

    @NotNull
    private OrderStatus orderStatus;
}