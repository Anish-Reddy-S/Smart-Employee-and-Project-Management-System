package com.enterprise.smartmanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "employees",
    indexes = {
        @Index(name = "idx_emp_code", columnList = "employee_code"),
        @Index(name = "idx_emp_email", columnList = "email"),
        @Index(name = "idx_emp_dept", columnList = "department_id")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "employee_code", nullable = false, unique = true, length = 20)
    private String employeeCode;

    @NotBlank
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    @Column(length = 20)
    private String phone;

    @NotBlank
    @Column(length = 50)
    private String designation;

    @NotNull
    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Positive
    @Column(precision = 10, scale = 2)
    private BigDecimal salary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @ManyToMany(mappedBy = "employees", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Project> projects = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum EmployeeStatus {
        ACTIVE, INACTIVE, ON_LEAVE, TERMINATED
    }
}
