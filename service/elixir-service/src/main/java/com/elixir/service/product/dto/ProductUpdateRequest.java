package com.elixir.service.product.dto;

import com.elixir.service.product.entity.ProductStatus;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductUpdateRequest {
    @Size(max = 150)
    private String name;

    @Size(max = 150)
    private String inspiredBy;

    private String description;
    private String note;

    @Size(max = 255)
    private String marketingTitle;

    @Size(max = 255)
    private String tagline;

    private String keywords;

    @Size(max = 100)
    private String lasting;

    private Boolean combo;
    private Boolean bestSeller;
    private ProductStatus status;
    private Long categoryId;
    private Long offerTagId;
}
