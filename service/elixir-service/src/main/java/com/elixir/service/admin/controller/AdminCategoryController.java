package com.elixir.service.admin.controller;

import com.elixir.service.category.dto.CategoryCreateRequest;
import com.elixir.service.category.dto.CategoryResponse;
import com.elixir.service.category.dto.CategoryUpdateRequest;
import com.elixir.service.category.service.CategoryService;
import com.elixir.service.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/categories")
@Tag(name = "Admin Categories", description = "Admin category management APIs")
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all categories", description = "Returns all admin categories.")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(
            HttpServletRequest request
    ) {
        List<CategoryResponse> categories = categoryService.getAll();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Categories retrieved successfully",
                        categories,
                        request.getRequestURI()
                )
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by id", description = "Returns a category by id.")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        CategoryResponse category = categoryService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Category retrieved successfully",
                        category,
                        request.getRequestURI()
                )
        );
    }

    @PostMapping
    @Operation(summary = "Create category", description = "Creates a new category.")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryCreateRequest requestBody,
            HttpServletRequest request
    ) {
        CategoryResponse category = categoryService.create(requestBody);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(
                        "Category created successfully",
                        category,
                        request.getRequestURI()
                ));
    }

    @PutMapping("/{id}")
        @Operation(summary = "Update category", description = "Updates an existing category.")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryUpdateRequest requestBody,
            HttpServletRequest request
    ) {
        CategoryResponse category = categoryService.update(id, requestBody);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Category updated successfully",
                        category,
                        request.getRequestURI()
                )
        );
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle category status", description = "Toggles the category active status.")
    public ResponseEntity<ApiResponse<CategoryResponse>> toggleCategoryStatus(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        CategoryResponse category = categoryService.toggleStatus(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Category status updated successfully",
                        category,
                        request.getRequestURI()
                )
        );
    }

    @DeleteMapping("/{id}")
        @Operation(summary = "Delete category", description = "Deletes a category.")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}