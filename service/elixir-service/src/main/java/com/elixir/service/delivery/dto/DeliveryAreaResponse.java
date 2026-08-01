package com.elixir.service.delivery.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Admin-facing response — includes management fields (active, timestamps).
// Public endpoints use DeliveryChargeResponse instead, which omits these.
@Getter
@Setter
@NoArgsConstructor
public class DeliveryAreaResponse {
    private Long id;
    private String district;
    private String upazila;
    private BigDecimal charge;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
