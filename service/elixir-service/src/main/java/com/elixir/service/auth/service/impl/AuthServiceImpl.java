package com.elixir.service.auth.service.impl;

import com.elixir.service.auth.dto.LoginRequest;
import com.elixir.service.auth.dto.LoginResponse;
import com.elixir.service.auth.service.AuthService;
import com.elixir.service.common.exception.InvalidCredentialsException;
import com.elixir.service.security.config.JwtProperties;
import com.elixir.service.security.jwt.JwtService;
import com.elixir.service.security.user.CustomUserDetails;
import com.elixir.service.security.user.CustomUserDetailsService;
import com.elixir.service.user.entity.User;
import com.elixir.service.user.entity.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        CustomUserDetails userDetails;

        try {
            userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(request.getEmail());
        } catch (UsernameNotFoundException exception) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userDetails.getUser();

        if (user.getDeletedAt() != null || !UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        LoginResponse response = new LoginResponse();
        response.setAccessToken(jwtService.generateAccessToken(userDetails));
        response.setTokenType("Bearer");
        response.setExpiresIn(jwtProperties.getAccessTokenExpiration() / 1000);
        response.setUser(toUserInfo(user));

        return response;
    }

    private LoginResponse.UserInfo toUserInfo(User user) {
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setName(user.getName());
        userInfo.setEmail(user.getEmail());
        userInfo.setRole(user.getRole());
        userInfo.setStatus(user.getStatus());
        return userInfo;
    }
}