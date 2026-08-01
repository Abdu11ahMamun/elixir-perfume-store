package com.elixir.service.product.service.impl;

import com.elixir.service.category.entity.Category;
import com.elixir.service.category.repository.CategoryRepository;
import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.offer.entity.OfferTag;
import com.elixir.service.offer.repository.OfferTagRepository;
import com.elixir.service.product.dto.ProductCreateRequest;
import com.elixir.service.product.dto.ProductResponse;
import com.elixir.service.product.dto.ProductSizeResponse;
import com.elixir.service.product.dto.ProductUpdateRequest;
import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductSize;
import com.elixir.service.product.entity.ProductStatus;
import com.elixir.service.product.repository.ProductRepository;
import com.elixir.service.product.repository.ProductSizeRepository;
import com.elixir.service.product.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OfferTagRepository offerTagRepository;
    private final ProductSizeRepository productSizeRepository;
    private final ObjectMapper objectMapper;

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
                .filter(existing -> existing.getDeletedAt() == null)
                .filter(existing -> Boolean.TRUE.equals(existing.getActive()))
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
    public Page<ProductResponse> getOfferProducts(int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);

        List<ProductResponse> products = productRepository.findByCombo(true)
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
    public Page<ProductResponse> getBestSellerProducts(int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);

        List<ProductResponse> products = productRepository.findByBestSeller(true)
            .stream()
            .filter(product -> product.getDeletedAt() == null)
            .filter(product -> ProductStatus.ACTIVE.equals(product.getStatus()))
            .sorted(resolveComparator(sort))
            .map(this::toResponse)
            .filter(response -> !response.getSizes().isEmpty())
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
        return productRepository.findAll().stream()
            .filter(product -> product.getDeletedAt() == null)
            .map(this::toResponse).toList();
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
        product.setMarketingTitle(request.getMarketingTitle());
        product.setTagline(request.getTagline());
        product.setKeywords(request.getKeywords());
        product.setLasting(request.getLasting());
        product.setCombo(request.getCombo());
        product.setBestSeller(request.getBestSeller());
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

        if (request.getName() != null) {
            existing.setName(request.getName());
        }

        if (request.getInspiredBy() != null) {
            existing.setInspiredBy(request.getInspiredBy());
        }

        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription());
        }

        if (request.getNote() != null) {
            existing.setNote(request.getNote());
        }

        if (request.getMarketingTitle() != null) {
            existing.setMarketingTitle(request.getMarketingTitle());
        }

        if (request.getTagline() != null) {
            existing.setTagline(request.getTagline());
        }

        if (request.getKeywords() != null) {
            existing.setKeywords(request.getKeywords());
        }

        if (request.getLasting() != null) {
            existing.setLasting(request.getLasting());
        }

        if (request.getCombo() != null) {
            existing.setCombo(request.getCombo());
        }

        if (request.getBestSeller() != null) {
            existing.setBestSeller(request.getBestSeller());
        }

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

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
        response.setMarketingTitle(product.getMarketingTitle());
        response.setTagline(product.getTagline());
        response.setKeywords(product.getKeywords());
        response.setLasting(product.getLasting());
        response.setCombo(product.getCombo());
        response.setBestSeller(product.getBestSeller());
        response.setStatus(product.getStatus());

        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }

        if (product.getOfferTag() != null) {
            response.setOfferTagId(product.getOfferTag().getId());
            response.setOfferTagName(product.getOfferTag().getName());
        }

        response.setSizes(getPublicSizes(product));

        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        return response;
    }
    private List<ProductSizeResponse> getPublicSizes(Product product) {
        return productSizeRepository.findByProduct(product)
                .stream()
                .filter(size -> Boolean.TRUE.equals(size.getActive()))
                .filter(size -> size.getDeletedAt() == null)
                .map(this::toSizeResponse)
                .toList();
    }

    private ProductSizeResponse toSizeResponse(ProductSize productSize) {
        ProductSizeResponse response = new ProductSizeResponse();

        response.setId(productSize.getId());
        response.setMl(productSize.getMl());
        response.setPrice(productSize.getPrice());
        response.setSku(productSize.getSku());
        response.setStock(productSize.getStock());
        response.setImageUrls(fromJson(productSize.getImageUrls()));

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

    @Override
    @Transactional
    public ProductResponse toggleStatus(Long id) {
        Product product = findProductById(id);

        if (ProductStatus.ACTIVE.equals(product.getStatus())) {
            product.setStatus(ProductStatus.ARCHIVED);
        } else {
            product.setStatus(ProductStatus.ACTIVE);
        }

        return toResponse(productRepository.save(product));
    }

    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .filter(product -> product.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
    private List<String> fromJson(String imageUrls) {
        if (imageUrls == null || imageUrls.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.readValue(imageUrls, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException exception) {
            return Collections.emptyList();
        }
    }
}