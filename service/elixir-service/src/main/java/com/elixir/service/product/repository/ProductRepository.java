package com.elixir.service.product.repository;

import com.elixir.service.category.entity.Category;
import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

	Page<Product> findByStatusAndDeletedAtIsNull(ProductStatus status, Pageable pageable);

	Optional<Product> findByIdAndStatusAndDeletedAtIsNull(Long id, ProductStatus status);

	Page<Product> findByCategoryAndStatusAndDeletedAtIsNull(Category category, ProductStatus status, Pageable pageable);

	List<Product> findByStatus(ProductStatus status);

	List<Product> findByCategory(Category category);

	List<Product> findByCombo(Boolean combo);

	boolean existsByName(String name);

	long countByDeletedAtIsNull();

	long countByStatusAndDeletedAtIsNull(ProductStatus status);
}
