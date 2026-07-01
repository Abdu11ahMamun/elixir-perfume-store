package com.elixir.service.user.service.impl;

import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.user.dto.UserCreateRequest;
import com.elixir.service.user.dto.UserResponse;
import com.elixir.service.user.dto.UserUpdateRequest;
import com.elixir.service.user.entity.User;
import com.elixir.service.user.entity.UserRole;
import com.elixir.service.user.entity.UserStatus;
import com.elixir.service.user.repository.UserRepository;
import com.elixir.service.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return toResponse(findUserById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getByPhone(String phone) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone already exists");
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // TODO: Hash password in security phase.
        user.setPasswordHash(request.getPassword());

        user.setRole(UserRole.CUSTOMER);
        user.setStatus(UserStatus.ACTIVE);

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        User existing = findUserById(id);

        if (request.getName() != null) {
            existing.setName(request.getName());
        }

        if (request.getEmail() != null) {
            existing.setEmail(request.getEmail());
        }

        if (request.getPhone() != null) {
            existing.setPhone(request.getPhone());
        }

        if (request.getRole() != null) {
            existing.setRole(request.getRole());
        }

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        User saved = userRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User existing = findUserById(id);
        existing.setDeletedAt(LocalDateTime.now());
        userRepository.save(existing);
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}