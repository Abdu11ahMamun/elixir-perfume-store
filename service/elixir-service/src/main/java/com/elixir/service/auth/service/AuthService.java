package com.elixir.service.auth.service;

import com.elixir.service.auth.dto.LoginRequest;
import com.elixir.service.auth.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}