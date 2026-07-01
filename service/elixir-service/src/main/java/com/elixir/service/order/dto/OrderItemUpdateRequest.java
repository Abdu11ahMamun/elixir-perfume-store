package com.elixir.service.order.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class OrderItemUpdateRequest {
    @Size(max = 150)
    private String productNameSnapshot;

    private Integer selectedMlSnapshot;

    @PositiveOrZero
    private BigDecimal unitPrice;

    @Positive
    private Integer quantity;

    @PositiveOrZero
    private BigDecimal lineTotal;
}
