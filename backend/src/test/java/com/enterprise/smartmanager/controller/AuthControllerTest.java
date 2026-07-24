package com.enterprise.smartmanager.controller;

import com.enterprise.smartmanager.dto.request.LoginRequest;
import com.enterprise.smartmanager.dto.response.JwtResponse;
import com.enterprise.smartmanager.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @WithMockUser
    void login_Success_Returns200AndJwtToken() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "AdminPassword123!");
        JwtResponse jwtResponse = new JwtResponse("mock_token_xyz", "Bearer", 1L, "admin", "admin@enterprise.com", "ADMIN");

        when(authService.login(any(LoginRequest.class))).thenReturn(jwtResponse);

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").value("mock_token_xyz"))
                .andExpect(jsonPath("$.data.username").value("admin"));
    }
}
