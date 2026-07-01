package com.elixir.service.product.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ProductSizeResponse {
    private Long id;
    private Long productId;
    private Integer ml;
    private BigDecimal price;
    private Integer stock;
    private String imageUrls;
    private String sku;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
