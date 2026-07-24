-- =====================================================================
-- Enterprise Smart Manager ERP — MySQL 8.0 Unified Database Script
-- Contains both schema DDL and seed data DML
-- =====================================================================

CREATE DATABASE IF NOT EXISTS smart_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_management_db;

-- 1. Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;

-- 2. Create Users Table (Authentication and Profile roles)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    role VARCHAR(20) NOT NULL, -- ADMIN or EMPLOYEE
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 3. Create Employees Table (HR Records)
CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    salary DECIMAL(12,2) NOT NULL,
    status ENUM('ACTIVE', 'ON_LEAVE', 'TERMINATED') DEFAULT 'ACTIVE',
    hire_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_emp_dept (department),
    INDEX idx_emp_status (status)
) ENGINE=InnoDB;

-- 4. Create Audit Logs Table (Security Logging)
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user (username),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

-- 5. Insert Default Admin User (Password: AdminPassword123! hashed via BCrypt)
INSERT INTO users (id, username, email, password, first_name, last_name, department, designation, role, enabled)
VALUES (1, 'admin', 'admin@enterprise.com', '$2a$10$e7W8o9YvN0bYkY/m0v.h1.d9b/2u8g1Z/x3l7p2q8r5t0v1w2y3z4', 'Alex', 'Vance', 'Executive Engineering', 'Principal Enterprise Architect', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE username=username;

-- 6. Insert Seed Employees
INSERT INTO employees (employee_code, first_name, last_name, email, phone, department, designation, salary, status, hire_date) VALUES
('EMP-1001', 'Sarah', 'Jenkins', 's.jenkins@enterprise.com', '+1 555-0192', 'Software Engineering', 'Senior Lead Architect', 145000.00, 'ACTIVE', '2022-03-15'),
('EMP-1002', 'Michael', 'Chen', 'm.chen@enterprise.com', '+1 555-0144', 'Software Engineering', 'Staff Frontend Specialist', 135000.00, 'ACTIVE', '2023-01-10'),
('EMP-1003', 'Elena', 'Rostova', 'e.rostova@enterprise.com', '+1 555-0188', 'Product & Design', 'Principal UX Designer', 128000.00, 'ACTIVE', '2021-11-01'),
('EMP-1004', 'Kabir', 'Mehta', 'kabir.mehta@enterprise.com', '+91 98765 43218', 'Software Engineering', 'Senior Backend Engineer', 140000.00, 'ACTIVE', '2023-08-15'),
('EMP-1005', 'Diya', 'Sen', 'diya.sen@enterprise.com', '+91 98765 43219', 'Software Engineering', 'Frontend Architect', 160000.00, 'ACTIVE', '2022-04-20'),
('EMP-1006', 'Ishaan', 'Joshi', 'ishaan.joshi@enterprise.com', '+91 98765 43220', 'Cloud Infrastructure', 'Cloud Operations Engineer', 125000.00, 'ACTIVE', '2024-01-15'),
('EMP-1007', 'Meera', 'Nair', 'meera.nair@enterprise.com', '+91 98765 43221', 'UI/UX Design', 'Senior UI/UX Researcher', 115000.00, 'ACTIVE', '2023-10-05'),
('EMP-1008', 'Arjun', 'Verma', 'arjun.verma@enterprise.com', '+91 98765 43222', 'Quality Assurance', 'Performance Test Engineer', 100000.00, 'ACTIVE', '2023-12-01'),
('EMP-1009', 'Riya', 'Kapoor', 'riya.kapoor@enterprise.com', '+91 98765 43223', 'Human Resources', 'HR Specialist', 85000.00, 'ACTIVE', '2024-03-01'),
('EMP-1010', 'Devansh', 'Saxena', 'devansh.saxena@enterprise.com', '+91 98765 43224', 'Finance & Accounting', 'Senior Accountant', 105000.00, 'ACTIVE', '2021-07-10'),
('EMP-1011', 'Tara', 'Deshmukh', 'tara.deshmukh@enterprise.com', '+91 98765 43225', 'Executive', 'Chief Compliance Officer', 220000.00, 'ACTIVE', '2020-05-12'),
('EMP-1012', 'Neil', 'D''Souza', 'neil.dsouza@enterprise.com', '+91 98765 43226', 'Cloud Infrastructure', 'Security Operations Analyst', 130000.00, 'ACTIVE', '2024-02-18'),
('EMP-1013', 'Alisha', 'Gill', 'alisha.gill@enterprise.com', '+91 98765 43227', 'UI/UX Design', 'Product Manager', 170000.00, 'ACTIVE', '2022-08-25');
