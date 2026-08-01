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
    private Boolean combo;
    private Boolean bestSeller;
    private ProductStatus status;
    private Long categoryId;
    private Long offerTagId;
}
