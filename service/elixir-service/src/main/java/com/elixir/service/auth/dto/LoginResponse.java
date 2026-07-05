package com.elixir.service.auth.dto;

import com.elixir.service.user.entity.UserRole;
import com.elixir.service.user.entity.UserStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {

    private String accessToken;

    private String tokenType;

    private long expiresIn;

    private UserInfo user;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private UserRole role;
        private UserStatus status;
    }
}