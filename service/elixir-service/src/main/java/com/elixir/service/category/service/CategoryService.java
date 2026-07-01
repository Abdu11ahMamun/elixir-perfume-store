package com.elixir.service.category.service;

import com.elixir.service.category.entity.Category;

import java.util.List;

public interface CategoryService {

    // TODO: Replace entity return types with DTOs in DTO phase.
    Category getById(Long id);

    Category getBySlug(String slug);

    List<Category> getAll();

    List<Category> getActive();

    Category create(Category category);

    Category update(Long id, Category category);

    void delete(Long id);
}