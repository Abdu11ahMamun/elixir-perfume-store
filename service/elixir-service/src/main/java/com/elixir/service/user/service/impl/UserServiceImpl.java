package com.elixir.service.user.service.impl;

import com.elixir.service.common.exception.BusinessValidationException;
import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.security.user.CustomUserDetails;
import com.elixir.service.user.dto.UserCreateRequest;
import com.elixir.service.user.dto.UserResponse;
import com.elixir.service.user.dto.UserUpdateRequest;
import com.elixir.service.user.entity.User;
import com.elixir.service.user.entity.UserRole;
import com.elixir.service.user.entity.UserStatus;
import com.elixir.service.user.repository.UserRepository;
import com.elixir.service.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return toResponse(findUserById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getByPhone(String phone) {
        User user = userRepository.findByPhone(phone)
                .filter(existing -> existing.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getDeletedAt() == null)
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public UserResponse create(UserCreateRequest request) {
        validateCreateRequest(request);

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
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        User existing = findUserById(id);

        if (request.getPhone() != null
                && !request.getPhone().equals(existing.getPhone())
                && userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone already exists");
        }

        if (request.getEmail() != null
                && !request.getEmail().equals(existing.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        if (request.getName() != null) {
            existing.setName(request.getName());
        }

        if (request.getEmail() != null) {
            existing.setEmail(request.getEmail());
        }

        if (request.getPhone() != null) {
            existing.setPhone(request.getPhone());
        }

        if (request.getRole() != null && !request.getRole().equals(existing.getRole())) {
            if (UserRole.ADMIN.equals(existing.getRole()) && !UserRole.ADMIN.equals(request.getRole())) {
                if (id.equals(currentUserId())) {
                    throw new BusinessValidationException("You cannot change your own admin role");
                }
                ensureNotLastActiveAdmin(existing);
            }

            existing.setRole(request.getRole());
        }

        if (request.getStatus() != null && !request.getStatus().equals(existing.getStatus())) {
            if (UserStatus.ACTIVE.equals(existing.getStatus()) && !UserStatus.ACTIVE.equals(request.getStatus())) {
                if (id.equals(currentUserId())) {
                    throw new BusinessValidationException("You cannot change your own account status");
                }
                ensureNotLastActiveAdmin(existing);
            }

            existing.setStatus(request.getStatus());
        }

        User saved = userRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse toggleStatus(Long id) {
        User existing = findUserById(id);

        if (UserStatus.ACTIVE.equals(existing.getStatus())) {
            if (id.equals(currentUserId())) {
                throw new BusinessValidationException("You cannot block your own account");
            }
            ensureNotLastActiveAdmin(existing);

            existing.setStatus(UserStatus.BLOCKED);
        } else {
            existing.setStatus(UserStatus.ACTIVE);
        }

        User saved = userRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User existing = findUserById(id);

        if (id.equals(currentUserId())) {
            throw new BusinessValidationException("You cannot delete your own account");
        }
        ensureNotLastActiveAdmin(existing);

        existing.setDeletedAt(LocalDateTime.now());
        existing.setStatus(UserStatus.DELETED);
        userRepository.save(existing);
    }

    private void ensureNotLastActiveAdmin(User target) {
        if (!UserRole.ADMIN.equals(target.getRole()) || !UserStatus.ACTIVE.equals(target.getStatus())) {
            return;
        }

        long otherActiveAdmins = userRepository.countByRoleAndStatusAndDeletedAtIsNullAndIdNot(
                UserRole.ADMIN,
                UserStatus.ACTIVE,
                target.getId()
        );

        if (otherActiveAdmins == 0) {
            throw new BusinessValidationException("Cannot modify the last active admin account");
        }
    }

    private Long currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails customUserDetails) {
            return customUserDetails.getId();
        }

        return null;
    }

    private void validateCreateRequest(UserCreateRequest request) {
        if (UserRole.ADMIN.equals(request.getRole())
                && (request.getEmail() == null || request.getEmail().isBlank())) {
            throw new BusinessValidationException("Email is required for admin users");
        }
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .filter(user -> user.getDeletedAt() == null)
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