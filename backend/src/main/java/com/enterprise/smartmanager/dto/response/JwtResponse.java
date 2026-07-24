package com.enterprise.smartmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private Long id;
    private String username;
    private String email;
    private String role; // ADMIN or EMPLOYEE
    private long expiresIn = 86400;

    public JwtResponse(String accessToken, String type, Long id, String username, String email, String role) {
        this.token = accessToken;
        this.type = type;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}
