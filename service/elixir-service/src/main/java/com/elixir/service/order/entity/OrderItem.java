package com.elixir.service.order.entity;

import com.elixir.service.common.entity.BaseEntity;
import com.elixir.service.product.entity.ProductSize;
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
        name = "order_items",
        indexes = {
                @Index(name = "idx_order_items_order", columnList = "order_id"),
                @Index(name = "idx_order_items_product_size", columnList = "product_size_id")
        }
)
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_size_id", nullable = false)
    private ProductSize productSize;

    @Column(name = "product_name_snapshot", nullable = false, length = 150)
    private String productNameSnapshot;

    @Column(name = "selected_ml_snapshot", nullable = false)
    private Integer selectedMlSnapshot;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "line_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;
}
