package com.elixir.service.product.service.impl;

import com.elixir.service.common.exception.BusinessValidationException;
import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductSize;
import com.elixir.service.product.repository.ProductSizeRepository;
import com.elixir.service.product.service.ProductSizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductSizeServiceImpl implements ProductSizeService {

    private static final Set<Integer> ALLOWED_ML = Set.of(6, 15, 30);

    private final ProductSizeRepository productSizeRepository;

    @Override
    @Transactional(readOnly = true)
    public ProductSize getById(Long id) {
        return productSizeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductSize getBySku(String sku) {
        return productSizeRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSize> getByProduct(Product product) {
        return productSizeRepository.findByProduct(product);
    }

    @Override
    @Transactional
    public ProductSize create(ProductSize productSize) {
        validateMl(productSize.getMl());

        if (productSizeRepository.existsBySku(productSize.getSku())) {
            throw new DuplicateResourceException("SKU already exists");
        }

        return productSizeRepository.save(productSize);
    }

    @Override
    @Transactional
    public ProductSize update(Long id, ProductSize productSize) {
        validateMl(productSize.getMl());

        ProductSize existing = getById(id);

        existing.setMl(productSize.getMl());
        existing.setPrice(productSize.getPrice());
        existing.setStock(productSize.getStock());
        existing.setImageUrls(productSize.getImageUrls());
        existing.setSku(productSize.getSku());
        existing.setActive(productSize.getActive());

        return productSizeRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ProductSize existing = getById(id);
        existing.setDeletedAt(LocalDateTime.now());
        productSizeRepository.save(existing);
    }

    private void validateMl(Integer ml) {
        if (!ALLOWED_ML.contains(ml)) {
            throw new BusinessValidationException("Product size must be 6, 15, or 30 ml");
        }
    }
}