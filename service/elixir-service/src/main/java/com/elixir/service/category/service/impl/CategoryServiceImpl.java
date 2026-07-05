package com.elixir.service.category.service.impl;

import com.elixir.service.category.dto.CategoryCreateRequest;
import com.elixir.service.category.dto.CategoryResponse;
import com.elixir.service.category.dto.CategoryUpdateRequest;
import com.elixir.service.category.entity.Category;
import com.elixir.service.category.repository.CategoryRepository;
import com.elixir.service.category.service.CategoryService;
import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        Category category = findCategoryById(id);
        return toResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        return toResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getActive() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .filter(category -> category.getDeletedAt() == null)
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public CategoryResponse create(CategoryCreateRequest request) {
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Category slug already exists");
        }

        Category category = toEntity(request);

        if (category.getActive() == null) {
            category.setActive(true);
        }

        Category saved = categoryRepository.save(category);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse update(Long id, CategoryUpdateRequest request) {
        Category existing = findCategoryById(id);

        if (request.getSlug() != null
                && !request.getSlug().equals(existing.getSlug())
                && categoryRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Category slug already exists");
        }

        applyUpdate(request, existing);

        Category saved = categoryRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse toggleStatus(Long id) {
        Category existing = findCategoryById(id);
        existing.setActive(!Boolean.TRUE.equals(existing.getActive()));

        Category saved = categoryRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Category existing = findCategoryById(id);
        existing.setDeletedAt(LocalDateTime.now());
        categoryRepository.save(existing);
    }

    private Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .filter(category -> category.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    private CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setSlug(category.getSlug());
        response.setDescription(category.getDescription());
        response.setActive(category.getActive());
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());
        return response;
    }

    private Category toEntity(CategoryCreateRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setActive(request.getActive());
        return category;
    }

    private void applyUpdate(CategoryUpdateRequest request, Category category) {
        if (request.getName() != null) {
            category.setName(request.getName());
        }

        if (request.getSlug() != null) {
            category.setSlug(request.getSlug());
        }

        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }

        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }
    }
}