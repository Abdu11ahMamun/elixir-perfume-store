package com.elixir.service.product.service;

import com.elixir.service.category.entity.Category;
import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductStatus;

import java.util.List;

public interface ProductService {

    // TODO: Replace entity return types with DTOs in DTO phase.
    Product getById(Long id);

    List<Product> getAll();

    List<Product> getByStatus(ProductStatus status);

    List<Product> getByCategory(Category category);

    List<Product> getByCombo(Boolean combo);

    Product create(Product product);

    Product update(Long id, Product product);

    void delete(Long id);
}