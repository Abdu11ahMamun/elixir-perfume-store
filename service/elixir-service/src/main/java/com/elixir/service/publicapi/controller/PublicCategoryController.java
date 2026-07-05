package com.elixir.service.publicapi.controller;

import com.elixir.service.category.dto.CategoryResponse;
import com.elixir.service.category.service.CategoryService;
import com.elixir.service.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public/categories")
@Tag(name = "Public Categories", description = "Public category browsing APIs")
public class PublicCategoryController {

    private final CategoryService categoryService;

    @GetMapping
        @Operation(summary = "Get active categories", description = "Returns all active public categories.")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getActiveCategories(
            HttpServletRequest request
    ) {
        List<CategoryResponse> categories = categoryService.getActive();

        ApiResponse<List<CategoryResponse>> response = ApiResponse.success(
                "Categories retrieved successfully",
                categories,
                request.getRequestURI()
        );

        return ResponseEntity.ok(response);
    }
}