package com.enterprise.smartmanager.service;

import com.enterprise.smartmanager.dto.request.EmployeeRequest;
import com.enterprise.smartmanager.dto.response.EmployeeResponse;
import com.enterprise.smartmanager.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmployeeService {
    Page<EmployeeResponse> getEmployees(String search, Pageable pageable);
    EmployeeResponse getEmployeeById(Long id);
    Employee getEmployeeEntityById(Long id);
    EmployeeResponse createEmployee(EmployeeRequest request);
    EmployeeResponse updateEmployee(Long id, EmployeeRequest request);
    void deleteEmployee(Long id);
}
