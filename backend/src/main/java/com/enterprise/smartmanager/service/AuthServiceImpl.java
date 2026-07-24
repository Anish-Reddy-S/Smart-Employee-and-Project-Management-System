package com.enterprise.smartmanager.service;

import com.enterprise.smartmanager.dto.request.LoginRequest;
import com.enterprise.smartmanager.dto.request.SignupRequest;
import com.enterprise.smartmanager.dto.response.JwtResponse;
import com.enterprise.smartmanager.entity.User;
import com.enterprise.smartmanager.repository.UserRepository;
import com.enterprise.smartmanager.security.jwt.JwtUtils;
import com.enterprise.smartmanager.security.services.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(AuthenticationManager authenticationManager, UserRepository userRepository,
                           PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return new JwtResponse(jwt, "Bearer", userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), user.getRole());
    }

    @Override
    @Transactional
    public JwtResponse register(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Validate and determine role (ADMIN or EMPLOYEE)
        String requestRole = signupRequest.getRole();
        String targetRole = "EMPLOYEE";
        if (requestRole != null) {
            String cleanedRole = requestRole.toUpperCase().replace("ROLE_", "");
            if (cleanedRole.equals("ADMIN")) {
                targetRole = "ADMIN";
            }
        }

        User user = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(encoder.encode(signupRequest.getPassword()))
                .firstName(signupRequest.getFirstName())
                .middleName(signupRequest.getMiddleName())
                .lastName(signupRequest.getLastName())
                .department(signupRequest.getDepartment())
                .designation(signupRequest.getDesignation())
                .role(targetRole)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        // Perform mock login to return Jwt token
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                UserDetailsImpl.build(savedUser), null, UserDetailsImpl.build(savedUser).getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new JwtResponse(jwt, "Bearer", savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), savedUser.getRole());
    }
}
