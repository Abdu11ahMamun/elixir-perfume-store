package com.elixir.service.product.dto;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ProductSizeUpdateRequest {
    private Integer ml;

    @PositiveOrZero
    private BigDecimal price;

    @PositiveOrZero
    private Integer stock;

    private String imageUrls;

    @Size(max = 100)
    private String sku;

    private Boolean active;
}
