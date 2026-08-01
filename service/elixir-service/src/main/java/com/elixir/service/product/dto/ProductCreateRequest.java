package com.elixir.service.product.dto;

import com.elixir.service.product.entity.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductCreateRequest {
    @NotBlank
    @Size(max = 150)
    private String name;

    @Size(max = 150)
    private String inspiredBy;

    private String description;
    private String note;
    private Boolean combo = false;
    private Boolean bestSeller = false;

    @NotNull
    private ProductStatus status;

    @NotNull
    private Long categoryId;

    private Long offerTagId;
}