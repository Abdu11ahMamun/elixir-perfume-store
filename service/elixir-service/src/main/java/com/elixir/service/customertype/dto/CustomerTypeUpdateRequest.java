package com.elixir.service.customertype.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CustomerTypeUpdateRequest {
    @Size(max = 100)
    private String name;

    private Integer displayOrder;

    private Boolean active;
}
