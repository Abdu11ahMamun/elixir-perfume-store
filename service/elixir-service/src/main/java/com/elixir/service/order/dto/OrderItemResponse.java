package com.elixir.service.order.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long orderId;
    private Long productSizeId;
    private String productNameSnapshot;
    private Integer selectedMlSnapshot;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal lineTotal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
