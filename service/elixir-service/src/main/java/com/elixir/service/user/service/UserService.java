package com.elixir.service.user.service;

import com.elixir.service.user.dto.UserCreateRequest;
import com.elixir.service.user.dto.UserResponse;
import com.elixir.service.user.dto.UserUpdateRequest;

import java.util.List;

public interface UserService {

    UserResponse getById(Long id);

    UserResponse getByPhone(String phone);

    List<UserResponse> getAll();

    UserResponse create(UserCreateRequest request);

    UserResponse update(Long id, UserUpdateRequest request);

    void delete(Long id);
}