package com.elixir.service.product.service;

import com.elixir.service.product.dto.ProductCreateRequest;
import com.elixir.service.product.dto.ProductResponse;
import com.elixir.service.product.dto.ProductUpdateRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    ProductResponse getById(Long id);

    List<ProductResponse> getAll();

    ProductResponse create(ProductCreateRequest request);

    ProductResponse update(Long id, ProductUpdateRequest request);

    void delete(Long id);

    Page<ProductResponse> getActiveProducts(int page, int size, String sort);

    ProductResponse getProduct(Long id);

    Page<ProductResponse> getProductsByCategory(Long categoryId, int page, int size, String sort);
}