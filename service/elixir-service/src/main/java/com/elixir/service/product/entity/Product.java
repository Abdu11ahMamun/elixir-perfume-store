package com.elixir.service.product.entity;

import com.elixir.service.category.entity.Category;
import com.elixir.service.common.entity.BaseEntity;
import com.elixir.service.offer.entity.OfferTag;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "products",
        indexes = {
                @Index(name = "idx_products_category", columnList = "category_id"),
                @Index(name = "idx_products_status", columnList = "status"),
                @Index(name = "idx_products_combo", columnList = "combo")
        }
)
public class Product extends BaseEntity {

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "inspired_by", length = 150)
    private String inspiredBy;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "combo", nullable = false)
    private Boolean combo = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ProductStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_tag_id")
    private OfferTag offerTag;
}