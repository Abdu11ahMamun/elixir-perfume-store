package com.elixir.service.customer.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CustomerResponse {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String district;
    private String upazila;
    private String address;
    private Long customerTypeId;
    private String customerTypeName;
    private Boolean active;

    // Computed live from order history — never stored/denormalized, so
    // these can't drift out of sync with the actual orders.
    private Integer totalOrders;
    private BigDecimal totalSpent;
    private LocalDateTime firstOrderAt;
    private LocalDateTime lastOrderAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
