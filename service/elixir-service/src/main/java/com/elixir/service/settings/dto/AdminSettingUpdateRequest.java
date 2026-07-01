package com.elixir.service.settings.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AdminSettingUpdateRequest {
    @Size(max = 120)
    private String settingKey;

    private String settingValue;

    @Size(max = 500)
    private String description;

    private Boolean active;
}
