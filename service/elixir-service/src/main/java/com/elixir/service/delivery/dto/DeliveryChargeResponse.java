package com.elixir.service.delivery.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

// Minimal public-facing shape for a resolved delivery charge — deliberately
// excludes admin-only fields (id, active, timestamps).
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryChargeResponse {
    private String district;
    private String upazila;
    private BigDecimal charge;
}
