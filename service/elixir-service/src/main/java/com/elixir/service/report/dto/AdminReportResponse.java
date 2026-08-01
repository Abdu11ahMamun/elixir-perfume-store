package com.elixir.service.report.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AdminReportResponse {

    private ReportPeriod period;

    private ReportSummary summary;

    private ReportComparison comparison;

    // Fixed explanatory text so the revenue rule is visible wherever this
    // response is consumed, not just in a code comment.
    private String revenueRuleNote;

    private List<RevenueTrendPoint> revenueTrend;

    private List<CategoryBreakdownItem> revenueByCategory;

    private List<TopProductItem> topProducts;

    private List<PaymentBreakdownItem> paymentMethods;

    private List<ExecutiveSignal> signals;
}
