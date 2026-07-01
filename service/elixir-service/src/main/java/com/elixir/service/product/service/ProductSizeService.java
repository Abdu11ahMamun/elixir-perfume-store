package com.elixir.service.product.service;

import com.elixir.service.product.dto.ProductSizeCreateRequest;
import com.elixir.service.product.dto.ProductSizeResponse;
import com.elixir.service.product.dto.ProductSizeUpdateRequest;

import java.util.List;

public interface ProductSizeService {

    ProductSizeResponse getById(Long id);

    ProductSizeResponse getBySku(String sku);

    List<ProductSizeResponse> getByProductId(Long productId);

    ProductSizeResponse create(ProductSizeCreateRequest request);

    ProductSizeResponse update(Long id, ProductSizeUpdateRequest request);

    void delete(Long id);
}