package com.elixir.service.product.repository;

import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductSize;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductSizeRepository extends JpaRepository<ProductSize, Long> {

	List<ProductSize> findByProduct(Product product);

	Optional<ProductSize> findBySku(String sku);

	boolean existsBySku(String sku);
}
