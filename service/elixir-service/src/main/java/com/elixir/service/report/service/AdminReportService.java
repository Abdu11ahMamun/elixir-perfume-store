package com.elixir.service.report.service;

import com.elixir.service.report.dto.AdminReportResponse;

import java.time.LocalDate;

public interface AdminReportService {

    AdminReportResponse getSummary(LocalDate startDate, LocalDate endDate);
}
