package com.elixir.service.delivery.dto;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class DeliveryAreaUpdateRequest {
    @Size(max = 100)
    private String district;

    // A blank string clears this back to district-wide (null); a fully
    // omitted/null field means "don't touch upazila".
    @Size(max = 100)
    private String upazila;

    @PositiveOrZero
    private BigDecimal charge;

    private Boolean active;
}
