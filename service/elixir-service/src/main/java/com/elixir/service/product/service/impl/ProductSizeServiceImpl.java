package com.elixir.service.product.service.impl;

import com.elixir.service.common.exception.BusinessValidationException;
import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.product.dto.ProductSizeCreateRequest;
import com.elixir.service.product.dto.ProductSizeResponse;
import com.elixir.service.product.dto.ProductSizeUpdateRequest;
import com.elixir.service.product.entity.Product;
import com.elixir.service.product.entity.ProductSize;
import com.elixir.service.product.repository.ProductRepository;
import com.elixir.service.product.repository.ProductSizeRepository;
import com.elixir.service.product.service.ProductSizeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductSizeServiceImpl implements ProductSizeService {

    private static final Set<Integer> ALLOWED_ML = Set.of(6, 15, 30);

    private final ProductSizeRepository productSizeRepository;
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public ProductSizeResponse getById(Long id) {
        ProductSize productSize = productSizeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));
        return toResponse(productSize);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductSizeResponse getBySku(String sku) {
        ProductSize productSize = productSizeRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));
        return toResponse(productSize);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSizeResponse> getByProductId(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return productSizeRepository.findByProduct(product).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public ProductSizeResponse create(ProductSizeCreateRequest request) {
        validateMl(request.getMl());
        validateImageUrls(request.getImageUrls());

        if (productSizeRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("SKU already exists");
        }

        Product product = productRepository.findById(request.getProductId())
                .filter(existing -> existing.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        ProductSize productSize = new ProductSize();
        productSize.setProduct(product);
        productSize.setMl(request.getMl());
        productSize.setPrice(request.getPrice());
        productSize.setStock(request.getStock());
        productSize.setImageUrls(toJson(request.getImageUrls()));
        productSize.setSku(request.getSku());
        productSize.setActive(request.getActive() != null ? request.getActive() : true);

        ProductSize saved = productSizeRepository.save(productSize);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ProductSizeResponse update(Long id, ProductSizeUpdateRequest request) {
        ProductSize existing = getProductSizeEntity(id);

        if (request.getMl() != null) {
            validateMl(request.getMl());
            existing.setMl(request.getMl());
        }

        if (request.getPrice() != null) {
            existing.setPrice(request.getPrice());
        }

        if (request.getStock() != null) {
            existing.setStock(request.getStock());
        }

        if (request.getImageUrls() != null) {
            validateImageUrls(request.getImageUrls());
            existing.setImageUrls(toJson(request.getImageUrls()));
        }

        if (request.getSku() != null) {
            existing.setSku(request.getSku());
        }

        if (request.getActive() != null) {
            existing.setActive(request.getActive());
        }

        ProductSize saved = productSizeRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ProductSize existing = productSizeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));
        existing.setDeletedAt(LocalDateTime.now());
        productSizeRepository.save(existing);
    }

    private void validateMl(Integer ml) {
        if (!ALLOWED_ML.contains(ml)) {
            throw new BusinessValidationException("Product size must be 6, 15, or 30 ml");
        }
    }

    private ProductSizeResponse toResponse(ProductSize productSize) {
        ProductSizeResponse response = new ProductSizeResponse();

        response.setId(productSize.getId());
        response.setMl(productSize.getMl());
        response.setPrice(productSize.getPrice());
        response.setSku(productSize.getSku());
        response.setStock(productSize.getStock());
        response.setImageUrls(fromJson(productSize.getImageUrls()));

        return response;
    }
    private ProductSize getProductSizeEntity(Long id) {
        return productSizeRepository.findById(id)
                .filter(productSize -> productSize.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));
    }

    private void validateImageUrls(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        for (String imageUrl : imageUrls) {
            if (imageUrl == null || imageUrl.isBlank()) {
                throw new BusinessValidationException("Image URL must not be blank");
            }

            boolean validLocalUpload = imageUrl.startsWith("/uploads/products/");
            boolean validHttpUrl = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

            if (!validLocalUpload && !validHttpUrl) {
                throw new BusinessValidationException("Invalid image URL format");
            }
        }
    }

    private String toJson(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(imageUrls);
        } catch (JsonProcessingException exception) {
            throw new BusinessValidationException("Invalid image URL data");
        }
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