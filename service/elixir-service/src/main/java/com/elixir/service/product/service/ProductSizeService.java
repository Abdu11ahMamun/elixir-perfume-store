package com.elixir.service.product.service;

import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductSize;

import java.util.List;

public interface ProductSizeService {

    // TODO: Replace entity return types with DTOs in DTO phase.
    ProductSize getById(Long id);

    ProductSize getBySku(String sku);

    List<ProductSize> getByProduct(Product product);

    ProductSize create(ProductSize productSize);

    ProductSize update(Long id, ProductSize productSize);

    void delete(Long id);
}