package com.elixir.service.category.service;

import com.elixir.service.category.dto.CategoryCreateRequest;
import com.elixir.service.category.dto.CategoryResponse;
import com.elixir.service.category.dto.CategoryUpdateRequest;

import java.util.List;

public interface CategoryService {

    CategoryResponse getById(Long id);

    CategoryResponse getBySlug(String slug);

    List<CategoryResponse> getAll();

    List<CategoryResponse> getActive();

    CategoryResponse create(CategoryCreateRequest request);

    CategoryResponse update(Long id, CategoryUpdateRequest request);

    CategoryResponse toggleStatus(Long id);

    void delete(Long id);
}