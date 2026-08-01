package com.elixir.service.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Percent change vs. the immediately preceding equal-length period. Null
// means "not a meaningful percentage" (previous period had a zero base),
// never a fabricated 0% or infinite value.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportComparison {

    private Double revenueChangePercent;

    private Double orderChangePercent;

    private Double customerChangePercent;

    private Double averageOrderValueChangePercent;
}
