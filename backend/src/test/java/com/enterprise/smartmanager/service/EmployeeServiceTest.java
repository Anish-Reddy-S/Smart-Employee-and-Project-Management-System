package com.enterprise.smartmanager.service;

import com.enterprise.smartmanager.entity.Employee;
import com.enterprise.smartmanager.exception.ResourceNotFoundException;
import com.enterprise.smartmanager.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private Employee sampleEmployee;

    @BeforeEach
    void setUp() {
        sampleEmployee = Employee.builder()
                .id(1L)
                .employeeCode("EMP-1001")
                .firstName("Sarah")
                .lastName("Jenkins")
                .email("s.jenkins@enterprise.com")
                .phone("+1 555-0192")
                .designation("Senior Lead Architect")
                .hireDate(LocalDate.of(2022, 3, 15))
                .salary(new BigDecimal("145000.00"))
                .status(Employee.EmployeeStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("Should return Employee when valid ID is provided")
    void getEmployeeById_Success() {
        // Arrange
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(sampleEmployee));

        // Act
        Employee result = employeeService.getEmployeeEntityById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmployeeCode()).isEqualTo("EMP-1001");
        assertThat(result.getEmail()).isEqualTo("s.jenkins@enterprise.com");
        verify(employeeRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when Employee ID does not exist")
    void getEmployeeById_NotFound_ThrowsException() {
        // Arrange
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> employeeService.getEmployeeEntityById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee not found with id 999");

        verify(employeeRepository, times(1)).findById(999L);
    }
}
