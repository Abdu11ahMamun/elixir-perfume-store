package com.elixir.service.offer.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OfferTagUpdateRequest {
    @Size(max = 100)
    private String name;

    @Size(max = 120)
    private String slug;

    @Size(max = 20)
    private String colorCode;

    private Boolean active;
}
