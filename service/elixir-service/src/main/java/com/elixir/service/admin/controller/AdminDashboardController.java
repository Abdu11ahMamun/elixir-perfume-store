package com.elixir.service.admin.controller;

import com.elixir.service.admin.dto.AdminDashboardSummaryResponse;
import com.elixir.service.admin.service.AdminDashboardService;
import com.elixir.service.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AdminDashboardSummaryResponse>> getSummary(
            HttpServletRequest request
    ) {
        AdminDashboardSummaryResponse summary = adminDashboardService.getSummary();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Dashboard summary retrieved successfully",
                        summary,
                        request.getRequestURI()
                )
        );
    }
}