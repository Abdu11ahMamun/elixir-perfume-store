package com.elixir.service.delivery.dto;

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
public class DeliveryAreaCreateRequest {
    @NotBlank
    @Size(max = 100)
    private String district;

    @Size(max = 100)
    private String upazila;

    @NotNull
    @PositiveOrZero
    private BigDecimal charge;

    private Boolean active = true;
}
