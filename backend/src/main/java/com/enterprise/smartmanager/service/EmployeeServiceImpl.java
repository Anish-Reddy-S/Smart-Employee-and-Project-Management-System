package com.enterprise.smartmanager.service;

import com.enterprise.smartmanager.dto.request.EmployeeRequest;
import com.enterprise.smartmanager.dto.response.EmployeeResponse;
import com.enterprise.smartmanager.entity.Department;
import com.enterprise.smartmanager.entity.Employee;
import com.enterprise.smartmanager.exception.ResourceNotFoundException;
import com.enterprise.smartmanager.repository.DepartmentRepository;
import com.enterprise.smartmanager.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponse> getEmployees(String search, Pageable pageable) {
        Page<Employee> page;
        if (search == null || search.trim().isEmpty()) {
            page = employeeRepository.findAll(pageable);
        } else {
            page = employeeRepository.searchEmployees(search.trim(), pageable);
        }
        return page.map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = getEmployeeEntityById(id);
        return convertToResponse(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public Employee getEmployeeEntityById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id));
    }

    @Override
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Error: Employee Code already exists!");
        }
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email already exists!");
        }

        Employee employee = Employee.builder()
                .employeeCode(request.getEmployeeCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .designation(request.getDesignation())
                .hireDate(request.getHireDate())
                .salary(request.getSalary())
                .build();

        if (request.getDepartment() != null && !request.getDepartment().trim().isEmpty()) {
            Department dept = departmentRepository.findByName(request.getDepartment())
                    .orElseGet(() -> departmentRepository.save(
                            Department.builder().name(request.getDepartment()).build()
                    ));
            employee.setDepartment(dept);
        }

        if (request.getStatus() != null) {
            try {
                employee.setStatus(Employee.EmployeeStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                employee.setStatus(Employee.EmployeeStatus.ACTIVE);
            }
        }

        Employee saved = employeeRepository.save(employee);
        return convertToResponse(saved);
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = getEmployeeEntityById(id);

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());
        employee.setHireDate(request.getHireDate());
        employee.setSalary(request.getSalary());

        if (request.getDepartment() != null && !request.getDepartment().trim().isEmpty()) {
            Department dept = departmentRepository.findByName(request.getDepartment())
                    .orElseGet(() -> departmentRepository.save(
                            Department.builder().name(request.getDepartment()).build()
                    ));
            employee.setDepartment(dept);
        }

        if (request.getStatus() != null) {
            try {
                employee.setStatus(Employee.EmployeeStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep original or active
            }
        }

        Employee updated = employeeRepository.save(employee);
        return convertToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeEntityById(id);
        employeeRepository.delete(employee);
    }

    private EmployeeResponse convertToResponse(Employee emp) {
        return EmployeeResponse.builder()
                .id(emp.getId())
                .employeeCode(emp.getEmployeeCode())
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .department(emp.getDepartment() != null ? emp.getDepartment().getName() : "")
                .designation(emp.getDesignation())
                .salary(emp.getSalary())
                .status(emp.getStatus().name())
                .hireDate(emp.getHireDate())
                .build();
    }
}
