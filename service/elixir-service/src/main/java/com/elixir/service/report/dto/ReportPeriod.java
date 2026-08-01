package com.elixir.service.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportPeriod {

    private LocalDate startDate;

    private LocalDate endDate;

    private String label;

    // How revenueTrend is bucketed for this range: DAY, WEEK, or MONTH.
    private String grouping;
}
