package com.elixir.service.delivery.entity;

import com.elixir.service.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "delivery_areas")
public class DeliveryArea extends BaseEntity {

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    // Null means the charge applies district-wide (no upazila-specific override).
    @Column(name = "upazila", length = 100)
    private String upazila;

    @Column(name = "charge", nullable = false, precision = 10, scale = 2, columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private BigDecimal charge = BigDecimal.ZERO;

    @Column(name = "active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean active = true;
}
