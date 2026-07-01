package com.elixir.service.user.service;

import com.elixir.service.user.entity.User;

import java.util.List;

public interface UserService {

    // TODO: Replace entity return types with DTOs in DTO phase.
    User getById(Long id);

    User getByPhone(String phone);

    List<User> getAll();

    User create(User user);

    User update(Long id, User user);

    void delete(Long id);
}