package com.elixir.service.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class OrderItemCreateRequest {
    @NotNull
    private Long orderId;

    @NotNull
    private Long productSizeId;

    @NotBlank
    @Size(max = 150)
    private String productNameSnapshot;

    @NotNull
    private Integer selectedMlSnapshot;

    @NotNull
    @PositiveOrZero
    private BigDecimal unitPrice;

    @NotNull
    @Positive
    private Integer quantity;

    @NotNull
    @PositiveOrZero
    private BigDecimal lineTotal;
}
