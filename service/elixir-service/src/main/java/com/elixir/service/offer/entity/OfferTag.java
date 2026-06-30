package com.elixir.service.offer.entity;

import com.elixir.service.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "offer_tags")
public class OfferTag extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "slug", nullable = false, unique = true, length = 120)
    private String slug;

    @Column(name = "color_code", length = 20)
    private String colorCode;

    @Column(name = "active", nullable = false)
    private Boolean active = true;
}