package com.elixir.service.publicapi.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.common.dto.PageResponse;
import com.elixir.service.product.dto.ProductResponse;
import com.elixir.service.product.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public/products")
public class PublicProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getActiveProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            HttpServletRequest request
    ) {
        Page<ProductResponse> products = productService.getActiveProducts(page, size, sort);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Products retrieved successfully",
                        PageResponse.fromPage(products, sort),
                        request.getRequestURI()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        ProductResponse product = productService.getProduct(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product retrieved successfully",
                        product,
                        request.getRequestURI()
                )
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            HttpServletRequest request
    ) {
        Page<ProductResponse> products = productService.getProductsByCategory(categoryId, page, size, sort);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Products by category retrieved successfully",
                        PageResponse.fromPage(products, sort),
                        request.getRequestURI()
                )
        );
    }
}