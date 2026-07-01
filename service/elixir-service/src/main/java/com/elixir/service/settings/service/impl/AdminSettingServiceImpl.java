package com.elixir.service.settings.service.impl;

import com.elixir.service.common.exception.DuplicateResourceException;
import com.elixir.service.common.exception.ResourceNotFoundException;
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
    public AdminSetting getById(Long id) {
        return adminSettingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin setting not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminSetting getBySettingKey(String settingKey) {
        return adminSettingRepository.findBySettingKey(settingKey)
                .orElseThrow(() -> new ResourceNotFoundException("Admin setting not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminSetting> getAll() {
        return adminSettingRepository.findAll();
    }

    @Override
    @Transactional
    public AdminSetting create(AdminSetting adminSetting) {
        if (adminSettingRepository.findBySettingKey(adminSetting.getSettingKey()).isPresent()) {
            throw new DuplicateResourceException("Setting key already exists");
        }

        return adminSettingRepository.save(adminSetting);
    }

    @Override
    @Transactional
    public AdminSetting update(Long id, AdminSetting adminSetting) {
        AdminSetting existing = getById(id);

        existing.setSettingKey(adminSetting.getSettingKey());
        existing.setSettingValue(adminSetting.getSettingValue());
        existing.setDescription(adminSetting.getDescription());
        existing.setActive(adminSetting.getActive());

        return adminSettingRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        AdminSetting existing = getById(id);
        existing.setDeletedAt(LocalDateTime.now());
        adminSettingRepository.save(existing);
    }
}