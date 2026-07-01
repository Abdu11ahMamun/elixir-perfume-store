package com.elixir.service.settings.service.impl;

import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
import com.elixir.service.settings.dto.AdminSettingCreateRequest;
import com.elixir.service.settings.dto.AdminSettingResponse;
import com.elixir.service.settings.dto.AdminSettingUpdateRequest;
import com.elixir.service.settings.entity.AdminSetting;
import com.elixir.service.settings.repository.AdminSettingRepository;
import com.elixir.service.settings.service.AdminSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminSettingServiceImpl implements AdminSettingService {

    private final AdminSettingRepository adminSettingRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminSettingResponse getById(Long id) {
        AdminSetting setting = adminSettingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin setting not found"));
        return toResponse(setting);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminSettingResponse getBySettingKey(String settingKey) {
        AdminSetting setting = adminSettingRepository.findBySettingKey(settingKey)
                .orElseThrow(() -> new ResourceNotFoundException("Admin setting not found"));
        return toResponse(setting);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminSettingResponse> getAll() {
        return adminSettingRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public AdminSettingResponse create(AdminSettingCreateRequest request) {
        if (adminSettingRepository.existsBySettingKey(request.getSettingKey())) {
            throw new DuplicateResourceException("Setting key already exists");
        }

        AdminSetting adminSetting = new AdminSetting();
        adminSetting.setSettingKey(request.getSettingKey());
        adminSetting.setSettingValue(request.getSettingValue());
        adminSetting.setDescription(request.getDescription());
        adminSetting.setActive(request.getActive());

        AdminSetting saved = adminSettingRepository.save(adminSetting);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public AdminSettingResponse update(Long id, AdminSettingUpdateRequest request) {
        AdminSetting existing = adminSettingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin setting not found"));

        existing.setSettingKey(request.getSettingKey());
        existing.setSettingValue(request.getSettingValue());
        existing.setDescription(request.getDescription());
        existing.setActive(request.getActive());

        AdminSetting saved = adminSettingRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        AdminSetting existing = adminSettingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin setting not found"));
        existing.setDeletedAt(LocalDateTime.now());
        adminSettingRepository.save(existing);
    }

    private AdminSettingResponse toResponse(AdminSetting setting) {
        AdminSettingResponse response = new AdminSettingResponse();
        response.setId(setting.getId());
        response.setSettingKey(setting.getSettingKey());
        response.setSettingValue(setting.getSettingValue());
        response.setDescription(setting.getDescription());
        response.setActive(setting.getActive());
        response.setCreatedAt(setting.getCreatedAt());
        response.setUpdatedAt(setting.getUpdatedAt());
        return response;
    }
}