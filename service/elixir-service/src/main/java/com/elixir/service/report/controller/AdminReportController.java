package com.elixir.service.report.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.report.dto.AdminReportResponse;
import com.elixir.service.report.service.AdminReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/reports")
@Tag(name = "Admin Reports", description = "Admin reporting APIs")
public class AdminReportController {

    private final AdminReportService adminReportService;

    @GetMapping("/summary")
    @Operation(summary = "Get report summary", description = "Returns real, database-calculated report metrics for the given date range.")
    public ResponseEntity<ApiResponse<AdminReportResponse>> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletRequest request
    ) {
        AdminReportResponse summary = adminReportService.getSummary(startDate, endDate);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Report summary retrieved successfully",
                        summary,
                        request.getRequestURI()
                )
        );
    }
}
