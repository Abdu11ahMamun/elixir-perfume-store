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
    private final ProductRepository productRepository;

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

        if (productSizeRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("SKU already exists");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        ProductSize productSize = new ProductSize();
        productSize.setProduct(product);
        productSize.setMl(request.getMl());
        productSize.setPrice(request.getPrice());
        productSize.setStock(request.getStock());
        productSize.setImageUrls(request.getImageUrls());
        productSize.setSku(request.getSku());
        productSize.setActive(request.getActive());

        ProductSize saved = productSizeRepository.save(productSize);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ProductSizeResponse update(Long id, ProductSizeUpdateRequest request) {
        if (request.getMl() != null) {
            validateMl(request.getMl());
        }

        ProductSize existing = productSizeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product size not found"));

        existing.setMl(request.getMl());
        existing.setPrice(request.getPrice());
        existing.setStock(request.getStock());
        existing.setImageUrls(request.getImageUrls());
        existing.setSku(request.getSku());
        existing.setActive(request.getActive());

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
        response.setProductId(productSize.getProduct() != null ? productSize.getProduct().getId() : null);
        response.setMl(productSize.getMl());
        response.setPrice(productSize.getPrice());
        response.setStock(productSize.getStock());
        response.setImageUrls(productSize.getImageUrls());
        response.setSku(productSize.getSku());
        response.setActive(productSize.getActive());
        response.setCreatedAt(productSize.getCreatedAt());
        response.setUpdatedAt(productSize.getUpdatedAt());
        return response;
    }
}