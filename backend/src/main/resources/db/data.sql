-- Initial DML Data Seed Script
USE smart_management_db;

-- Insert Default Admin User (Password: AdminPassword123! hashed via BCrypt)
-- Mapped with role = 'ADMIN'
INSERT INTO users (id, username, email, password, first_name, last_name, department, designation, role, enabled)
VALUES (1, 'admin', 'admin@enterprise.com', '$2a$10$e7W8o9YvN0bYkY/m0v.h1.d9b/2u8g1Z/x3l7p2q8r5t0v1w2y3z4', 'Alex', 'Vance', 'Executive Engineering', 'Principal Enterprise Architect', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE username=username;

-- Insert Seed Employees
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

