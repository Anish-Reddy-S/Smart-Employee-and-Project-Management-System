package com.enterprise.smartmanager.controller;

import com.enterprise.smartmanager.dto.request.LoginRequest;
import com.enterprise.smartmanager.dto.request.SignupRequest;
import com.enterprise.smartmanager.dto.response.ApiResponse;
import com.enterprise.smartmanager.dto.response.JwtResponse;
import com.enterprise.smartmanager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication Controller", description = "Endpoints for JWT Authentication, Login, and Registration")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user credentials and generate JWT token")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", jwtResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new employee user account")
    public ResponseEntity<ApiResponse<JwtResponse>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        JwtResponse jwtResponse = authService.register(signUpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("User registered successfully", jwtResponse));
    }
}
