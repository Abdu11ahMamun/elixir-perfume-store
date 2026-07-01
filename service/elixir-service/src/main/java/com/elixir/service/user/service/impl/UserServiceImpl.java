package com.elixir.service.user.service.impl;

import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.user.entity.User;
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
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public User getByPhone(String phone) {
        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User create(User user) {
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new DuplicateResourceException("Phone already exists");
        }

        if (user.getEmail() != null && userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User update(Long id, User user) {
        User existing = getById(id);

        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        existing.setPhone(user.getPhone());
        existing.setRole(user.getRole());
        existing.setStatus(user.getStatus());

        return userRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User existing = getById(id);
        existing.setDeletedAt(LocalDateTime.now());
        userRepository.save(existing);
    }
}