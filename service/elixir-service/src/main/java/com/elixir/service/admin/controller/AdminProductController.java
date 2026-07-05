package com.elixir.service.admin.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.product.dto.ProductCreateRequest;
import com.elixir.service.product.dto.ProductResponse;
import com.elixir.service.product.dto.ProductSizeCreateRequest;
import com.elixir.service.product.dto.ProductSizeResponse;
import com.elixir.service.product.dto.ProductSizeUpdateRequest;
import com.elixir.service.product.dto.ProductUpdateRequest;
import com.elixir.service.product.service.ProductService;
import com.elixir.service.product.service.ProductSizeService;
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
@RequestMapping("/api/v1/admin/products")
@Tag(name = "Admin Products", description = "Admin product and product size management APIs")
public class AdminProductController {

    private final ProductService productService;
    private final ProductSizeService productSizeService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Returns all admin products.")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts(
            HttpServletRequest request
    ) {
        List<ProductResponse> products = productService.getAll();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Products retrieved successfully",
                        products,
                        request.getRequestURI()
                )
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by id", description = "Returns a product by id.")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        ProductResponse product = productService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product retrieved successfully",
                        product,
                        request.getRequestURI()
                )
        );
    }

    @PostMapping
    @Operation(summary = "Create product", description = "Creates a new product.")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductCreateRequest requestBody,
            HttpServletRequest request
    ) {
        ProductResponse product = productService.create(requestBody);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(
                        "Product created successfully",
                        product,
                        request.getRequestURI()
                ));
    }

    @PutMapping("/{id}")
        @Operation(summary = "Update product", description = "Updates an existing product.")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest requestBody,
            HttpServletRequest request
    ) {
        ProductResponse product = productService.update(id, requestBody);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product updated successfully",
                        product,
                        request.getRequestURI()
                )
        );
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Toggle product status", description = "Toggles the product status.")
    public ResponseEntity<ApiResponse<ProductResponse>> toggleProductStatus(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        ProductResponse product = productService.toggleStatus(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product status updated successfully",
                        product,
                        request.getRequestURI()
                )
        );
    }

    @DeleteMapping("/{id}")
        @Operation(summary = "Delete product", description = "Deletes a product.")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{productId}/sizes")
        @Operation(summary = "Create product size", description = "Creates a new product size.")
    public ResponseEntity<ApiResponse<ProductSizeResponse>> createProductSize(
            @PathVariable Long productId,
            @Valid @RequestBody ProductSizeCreateRequest requestBody,
            HttpServletRequest request
    ) {
        requestBody.setProductId(productId);

        ProductSizeResponse size = productSizeService.create(requestBody);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(
                        "Product size created successfully",
                        size,
                        request.getRequestURI()
                ));
    }

    @PutMapping("/sizes/{sizeId}")
        @Operation(summary = "Update product size", description = "Updates an existing product size.")
    public ResponseEntity<ApiResponse<ProductSizeResponse>> updateProductSize(
            @PathVariable Long sizeId,
            @Valid @RequestBody ProductSizeUpdateRequest requestBody,
            HttpServletRequest request
    ) {
        ProductSizeResponse size = productSizeService.update(sizeId, requestBody);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product size updated successfully",
                        size,
                        request.getRequestURI()
                )
        );
    }

    @DeleteMapping("/sizes/{sizeId}")
        @Operation(summary = "Delete product size", description = "Deletes a product size.")
    public ResponseEntity<Void> deleteProductSize(@PathVariable Long sizeId) {
        productSizeService.delete(sizeId);
        return ResponseEntity.noContent().build();
    }
}