package com.elixir.service.customertype.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CustomerTypeCreateRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    private Integer displayOrder = 0;

    private Boolean active = true;
}
