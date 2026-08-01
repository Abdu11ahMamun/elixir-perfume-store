package com.elixir.service.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummary {

    private BigDecimal totalRevenue;

    private Long totalOrders;

    private BigDecimal averageOrderValue;

    private Long totalCustomers;

    private Long completedOrders;

    private Long pendingOrders;

    private Long cancelledOrders;
}
