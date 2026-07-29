package com.elixir.service.product.repository;

import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductSize;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.List;
import java.util.Optional;

public interface ProductSizeRepository extends JpaRepository<ProductSize, Long> {

	List<ProductSize> findByProduct(Product product);

	Optional<ProductSize> findBySku(String sku);

	boolean existsBySku(String sku);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	Optional<ProductSize> findByIdAndDeletedAtIsNull(Long id);
}
