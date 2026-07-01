package com.elixir.service.category.service.impl;

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
    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Category getBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getActive() {
        return categoryRepository.findByActiveTrue();
    }

    @Override
    @Transactional
    public Category create(Category category) {
        if (categoryRepository.existsBySlug(category.getSlug())) {
            throw new DuplicateResourceException("Category slug already exists");
        }

        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category update(Long id, Category category) {
        Category existing = getById(id);

        existing.setName(category.getName());
        existing.setSlug(category.getSlug());
        existing.setDescription(category.getDescription());
        existing.setActive(category.getActive());

        return categoryRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Category existing = getById(id);
        existing.setDeletedAt(LocalDateTime.now());
        categoryRepository.save(existing);
    }
}