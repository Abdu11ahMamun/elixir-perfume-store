package com.elixir.service.product.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ProductSizeResponse {
    private Long id;
    private Integer ml;
    private BigDecimal price;
    private String sku;
    private Integer stock;
    private String imageUrls;
}