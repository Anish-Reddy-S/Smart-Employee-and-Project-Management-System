package com.enterprise.smartmanager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Valid corporate email required")
    @Email
    @Size(max = 100)
    private String email;

    @NotBlank(message = "Password must be at least 4 characters long")
    @Size(min = 4, max = 100)
    private String password;

    @NotBlank(message = "First Name is required")
    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String middleName; // Optional

    @NotBlank(message = "Last Name is required")
    @Size(max = 50)
    private String lastName;

    private String department; // Optional

    private String designation; // Optional

    private String role; // Defaults to EMPLOYEE
}
