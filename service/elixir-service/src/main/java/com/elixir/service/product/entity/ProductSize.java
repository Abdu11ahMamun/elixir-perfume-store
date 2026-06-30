package com.elixir.service.product.entity;

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
@Table(
        name = "product_sizes",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_product_size_ml", columnNames = {"product_id", "ml"})
        },
        indexes = {
                @Index(name = "idx_product_sizes_product", columnList = "product_id"),
                @Index(name = "idx_product_sizes_sku", columnList = "sku")
        }
)
public class ProductSize extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "ml", nullable = false)
    private Integer ml;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "image_urls", columnDefinition = "JSON")
    private String imageUrls;

    @Column(name = "sku", nullable = false, unique = true, length = 100)
    private String sku;

    @Column(name = "active", nullable = false)
    private Boolean active = true;
}
