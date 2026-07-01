package com.elixir.service.product.dto;

import com.elixir.service.product.entity.ProductStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String inspiredBy;
    private String description;
    private String note;
    private Boolean combo;
    private ProductStatus status;
    private Long categoryId;
    private String categoryName;
    private Long offerTagId;
    private String offerTagName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
