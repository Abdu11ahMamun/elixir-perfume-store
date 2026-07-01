package com.elixir.service.settings.service;

import com.elixir.service.settings.dto.AdminSettingCreateRequest;
import com.elixir.service.settings.dto.AdminSettingResponse;
import com.elixir.service.settings.dto.AdminSettingUpdateRequest;

import java.util.List;

public interface AdminSettingService {

    AdminSettingResponse getById(Long id);

    AdminSettingResponse getBySettingKey(String settingKey);

    List<AdminSettingResponse> getAll();

    AdminSettingResponse create(AdminSettingCreateRequest request);

    AdminSettingResponse update(Long id, AdminSettingUpdateRequest request);

    void delete(Long id);
}