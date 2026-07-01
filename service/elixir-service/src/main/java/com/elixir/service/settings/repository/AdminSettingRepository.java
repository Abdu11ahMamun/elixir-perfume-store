package com.elixir.service.settings.repository;

import com.elixir.service.settings.entity.AdminSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminSettingRepository extends JpaRepository<AdminSetting, Long> {

    Optional<AdminSetting> findBySettingKey(String settingKey);

    boolean existsBySettingKey(String settingKey);
}
