package com.enterprise.smartmanager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {
    @NotBlank(message = "Employee code must match pattern EMP-[0-9]{4}")
    private String employeeCode;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email address must belong to @enterprise.com domain")
    @Email
    private String email;

    private String phone;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;

    @NotNull(message = "Salary must be greater than or equal to $3,000")
    @Positive
    private BigDecimal salary;

    private String department;

    private String status;
}
