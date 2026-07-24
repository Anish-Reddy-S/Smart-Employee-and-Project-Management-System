package com.enterprise.smartmanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Username cannot be blank (@NotBlank constraint)")
    private String username;

    @NotBlank(message = "Password cannot be blank (@NotBlank constraint)")
    private String password;
}
