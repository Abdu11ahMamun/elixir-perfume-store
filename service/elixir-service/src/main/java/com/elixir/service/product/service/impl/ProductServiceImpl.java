package com.elixir.service.product.service.impl;

import com.elixir.service.category.entity.Category;
import com.elixir.service.category.repository.CategoryRepository;
import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.offer.entity.OfferTag;
import com.elixir.service.offer.repository.OfferTagRepository;
import com.elixir.service.product.dto.ProductCreateRequest;
import com.elixir.service.product.dto.ProductResponse;
import com.elixir.service.product.dto.ProductUpdateRequest;
import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductStatus;
import com.elixir.service.product.repository.ProductRepository;
import com.elixir.service.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OfferTagRepository offerTagRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getActiveProducts(int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);

        List<ProductResponse> products = productRepository.findByStatus(ProductStatus.ACTIVE)
            .stream()
            .filter(product -> product.getDeletedAt() == null)
            .sorted(resolveComparator(sort))
            .map(this::toResponse)
            .toList();

        return toPage(products, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
            .filter(existing -> existing.getDeletedAt() == null)
            .filter(existing -> ProductStatus.ACTIVE.equals(existing.getStatus()))
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(Long categoryId, int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        List<ProductResponse> products = productRepository.findByCategory(category)
            .stream()
            .filter(product -> product.getDeletedAt() == null)
            .filter(product -> ProductStatus.ACTIVE.equals(product.getStatus()))
            .sorted(resolveComparator(sort))
            .map(this::toResponse)
            .toList();

        return toPage(products, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAll() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public ProductResponse create(ProductCreateRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Product name already exists");
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setInspiredBy(request.getInspiredBy());
        product.setDescription(request.getDescription());
        product.setNote(request.getNote());
        product.setCombo(request.getCombo());
        product.setStatus(request.getStatus());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        product.setCategory(category);

        if (request.getOfferTagId() != null) {
            OfferTag offerTag = offerTagRepository.findById(request.getOfferTagId())
                    .orElseThrow(() -> new ResourceNotFoundException("Offer tag not found"));
            product.setOfferTag(offerTag);
        }

        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ProductResponse update(Long id, ProductUpdateRequest request) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        existing.setName(request.getName());
        existing.setInspiredBy(request.getInspiredBy());
        existing.setDescription(request.getDescription());
        existing.setNote(request.getNote());
        existing.setCombo(request.getCombo());
        existing.setStatus(request.getStatus());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            existing.setCategory(category);
        }

        if (request.getOfferTagId() != null) {
            OfferTag offerTag = offerTagRepository.findById(request.getOfferTagId())
                    .orElseThrow(() -> new ResourceNotFoundException("Offer tag not found"));
            existing.setOfferTag(offerTag);
        } else {
            existing.setOfferTag(null);
        }

        Product saved = productRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        existing.setDeletedAt(LocalDateTime.now());
        productRepository.save(existing);
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setInspiredBy(product.getInspiredBy());
        response.setDescription(product.getDescription());
        response.setNote(product.getNote());
        response.setCombo(product.getCombo());
        response.setStatus(product.getStatus());
        response.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        response.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        response.setOfferTagId(product.getOfferTag() != null ? product.getOfferTag().getId() : null);
        response.setOfferTagName(product.getOfferTag() != null ? product.getOfferTag().getName() : null);
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }

    private Pageable buildPageable(int page, int size, String sort) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        String[] sortParts = sort.split(",");
        String sortField = sortParts.length > 0 ? sortParts[0] : "createdAt";
        Sort.Direction direction = sortParts.length > 1 && "asc".equalsIgnoreCase(sortParts[1])
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return PageRequest.of(safePage, safeSize, Sort.by(direction, sortField));
    }

    private Page<ProductResponse> toPage(List<ProductResponse> products, Pageable pageable) {
        int start = (int) pageable.getOffset();

        if (start >= products.size()) {
            return new PageImpl<>(List.of(), pageable, products.size());
        }

        int end = Math.min(start + pageable.getPageSize(), products.size());

        return new PageImpl<>(products.subList(start, end), pageable, products.size());
    }

    private Comparator<Product> resolveComparator(String sort) {
        boolean ascending = sort != null && sort.toLowerCase().endsWith(",asc");

        Comparator<Product> comparator = Comparator.comparing(
                Product::getCreatedAt,
                Comparator.nullsLast(Comparator.naturalOrder())
        );

        if (sort != null && sort.startsWith("name")) {
            comparator = Comparator.comparing(
                    Product::getName,
                    Comparator.nullsLast(String::compareToIgnoreCase)
            );
        }

        return ascending ? comparator : comparator.reversed();
    }
}