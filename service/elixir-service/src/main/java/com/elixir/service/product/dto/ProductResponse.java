package com.elixir.service.product.dto;

import com.elixir.service.product.entity.ProductStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponse {

    private Long id;

    private String name;

    private String inspiredBy;

    private String description;

    private String note;

    private String marketingTitle;

    private String tagline;

    private String keywords;

    private String lasting;

    private Boolean combo;

    private Boolean bestSeller;

    private ProductStatus status;

    private Long categoryId;

    private String categoryName;

    private Long offerTagId;

    private String offerTagName;

    private List<ProductSizeResponse> sizes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}