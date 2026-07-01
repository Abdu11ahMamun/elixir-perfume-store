package com.elixir.service.product.service;

import com.elixir.service.product.dto.ProductCreateRequest;
import com.elixir.service.product.dto.ProductResponse;
import com.elixir.service.product.dto.ProductUpdateRequest;
import com.elixir.service.product.entity.ProductStatus;

import java.util.List;

public interface ProductService {

    ProductResponse getById(Long id);

    List<ProductResponse> getAll();

    List<ProductResponse> getByStatus(ProductStatus status);

    List<ProductResponse> getByCategory(Long categoryId);

    List<ProductResponse> getByCombo(Boolean combo);

    ProductResponse create(ProductCreateRequest request);

    ProductResponse update(Long id, ProductUpdateRequest request);

    void delete(Long id);
}