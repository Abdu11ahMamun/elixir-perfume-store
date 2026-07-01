package com.elixir.service.offer.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class OfferTagResponse {
    private Long id;
    private String name;
    private String slug;
    private String colorCode;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
