package com.elixir.service.auth.controller;

import com.elixir.service.auth.dto.LoginRequest;
import com.elixir.service.auth.dto.LoginResponse;
import com.elixir.service.auth.service.AuthService;
import com.elixir.service.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest requestBody,
            HttpServletRequest request
    ) {
        LoginResponse response = authService.login(requestBody);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful",
                        response,
                        request.getRequestURI()
                )
        );
    }
}