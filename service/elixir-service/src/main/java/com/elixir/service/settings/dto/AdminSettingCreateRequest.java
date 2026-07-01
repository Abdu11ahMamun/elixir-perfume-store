package com.elixir.service.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AdminSettingCreateRequest {
    @NotBlank
    @Size(max = 120)
    private String settingKey;

    @NotBlank
    private String settingValue;

    @Size(max = 500)
    private String description;

    private Boolean active = true;
}
