package com.elixir.service.admin.controller;

import com.elixir.service.admin.dto.AdminDashboardSummaryResponse;
import com.elixir.service.admin.service.AdminDashboardService;
import com.elixir.service.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/dashboard")
@Tag(name = "Admin Dashboard", description = "Admin dashboard summary APIs")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary", description = "Returns the admin dashboard summary.")
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