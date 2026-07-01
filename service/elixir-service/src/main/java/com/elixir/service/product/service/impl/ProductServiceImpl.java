package com.elixir.service.product.service.impl;

import com.elixir.service.category.entity.Category;
import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductStatus;
import com.elixir.service.product.repository.ProductRepository;
import com.elixir.service.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getByStatus(ProductStatus status) {
        return productRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getByCategory(Category category) {
        return productRepository.findByCategory(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getByCombo(Boolean combo) {
        return productRepository.findByCombo(combo);
    }

    @Override
    @Transactional
    public Product create(Product product) {
        if (productRepository.existsByName(product.getName())) {
            throw new DuplicateResourceException("Product name already exists");
        }

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product update(Long id, Product product) {
        Product existing = getById(id);

        existing.setName(product.getName());
        existing.setInspiredBy(product.getInspiredBy());
        existing.setDescription(product.getDescription());
        existing.setNote(product.getNote());
        existing.setCombo(product.getCombo());
        existing.setStatus(product.getStatus());
        existing.setCategory(product.getCategory());
        existing.setOfferTag(product.getOfferTag());

        return productRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Product existing = getById(id);
        existing.setDeletedAt(LocalDateTime.now());
        productRepository.save(existing);
    }
}