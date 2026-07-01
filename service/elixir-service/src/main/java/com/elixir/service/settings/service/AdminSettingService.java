package com.elixir.service.settings.service;

import com.elixir.service.settings.entity.AdminSetting;

import java.util.List;

public interface AdminSettingService {

    // TODO: Replace entity return types with DTOs in DTO phase.
    AdminSetting getById(Long id);

    AdminSetting getBySettingKey(String settingKey);

    List<AdminSetting> getAll();

    AdminSetting create(AdminSetting adminSetting);

    AdminSetting update(Long id, AdminSetting adminSetting);

    void delete(Long id);
}