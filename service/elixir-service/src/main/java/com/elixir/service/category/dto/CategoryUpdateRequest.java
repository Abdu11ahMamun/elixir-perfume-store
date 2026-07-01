package com.elixir.service.category.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoryUpdateRequest {
    @Size(max = 100)
    private String name;

    @Size(max = 120)
    private String slug;

    @Size(max = 500)
    private String description;

    private Boolean active;
}
