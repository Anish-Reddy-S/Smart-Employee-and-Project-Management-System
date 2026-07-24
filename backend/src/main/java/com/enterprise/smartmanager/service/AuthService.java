package com.enterprise.smartmanager.service;

import com.enterprise.smartmanager.dto.request.LoginRequest;
import com.enterprise.smartmanager.dto.request.SignupRequest;
import com.enterprise.smartmanager.dto.response.JwtResponse;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);
    JwtResponse register(SignupRequest signupRequest);
}
