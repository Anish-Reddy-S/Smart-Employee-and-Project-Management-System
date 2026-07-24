-- Enterprise Smart Manager ERP — MySQL 8.0 DDL Database Schema Script
CREATE DATABASE IF NOT EXISTS smartmanager_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartmanager_db;

-- 1. Users Table (containing a single role column)
CREATE TABLE IF NOT EXISTS users (
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

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS employees (
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

-- 3. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
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
