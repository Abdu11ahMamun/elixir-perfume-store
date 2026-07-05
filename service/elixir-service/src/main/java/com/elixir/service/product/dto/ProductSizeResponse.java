package com.elixir.service.product.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProductSizeResponse {

    private Long id;

    private Integer ml;

    private BigDecimal price;

    private String sku;

    private Integer stock;

    private List<String> imageUrls;
}