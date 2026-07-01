package com.elixir.service.category.mapper;

import com.elixir.service.category.dto.CategoryCreateRequest;
import com.elixir.service.category.dto.CategoryResponse;
import com.elixir.service.category.dto.CategoryUpdateRequest;
import com.elixir.service.category.entity.Category;

public interface CategoryMapper {
    CategoryResponse toResponse(Category category);

    Category toEntity(CategoryCreateRequest request);

    void updateEntity(CategoryUpdateRequest request, Category category);
}
