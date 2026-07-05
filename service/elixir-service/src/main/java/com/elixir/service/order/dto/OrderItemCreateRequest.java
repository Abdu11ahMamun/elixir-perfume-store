package com.elixir.service.order.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderItemCreateRequest {

    @NotNull
    private Long productSizeId;

    @NotNull
    @Positive
    private Integer quantity;
}