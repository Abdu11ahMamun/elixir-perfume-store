package com.elixir.service.settings.entity;

import com.elixir.service.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "admin_settings")
public class AdminSetting extends BaseEntity {

    @Column(name = "setting_key", nullable = false, unique = true, length = 120)
    private String settingKey;

    @Column(name = "setting_value", nullable = false, columnDefinition = "TEXT")
    private String settingValue;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "active", nullable = false)
    private Boolean active = true;
}
