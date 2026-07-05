package com.elixir.service.admin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class AdminDashboardSummaryResponse {

    private Long totalProducts;

    private Long activeProducts;

    private Long totalOrders;

    private Long pendingOrders;

    private BigDecimal totalRevenue;

    private Long totalCustomers;
}