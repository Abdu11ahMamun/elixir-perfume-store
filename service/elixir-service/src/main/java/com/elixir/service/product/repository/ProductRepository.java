package com.elixir.service.product.repository;

import com.elixir.service.category.entity.Category;
import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findByStatus(ProductStatus status);

	List<Product> findByCategory(Category category);

	List<Product> findByCombo(Boolean combo);

	boolean existsByName(String name);
}
