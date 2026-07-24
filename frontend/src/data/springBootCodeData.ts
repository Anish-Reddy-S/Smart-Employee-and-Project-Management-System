import { CodeFile } from '../types';

export const BACKEND_CONFIG_FILES: CodeFile[] = [
  {
    filename: 'pom.xml',
    path: 'pom.xml',
    language: 'xml',
    description: 'Maven Project Object Model with Java 17, Spring Boot 3.2.x, Spring Security, JWT, Spring Data JPA, MySQL, Lombok, OpenAPI, JavaMail & Actuator',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>

    <groupId>com.enterprise</groupId>
    <artifactId>smartmanager-backend</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>smartmanager-backend</name>
    <description>Enterprise Smart Employee Management System - Spring Boot 3 Backend</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.11.5</jjwt.version>
        <springdoc.version>2.3.0</springdoc.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Jakarta Bean Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Spring Boot Mail -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>

        <!-- Spring Boot Actuator & Metrics -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JJWT (JSON Web Token) -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- OpenAPI / Swagger UI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>\${springdoc.version}</version>
        </dependency>

        <!-- Spring Boot Test Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
`,
  },
  {
    filename: 'application.properties',
    path: 'src/main/resources/application.properties',
    language: 'properties',
    description: 'Spring Boot 3 application configuration file with HikariCP pool, MySQL connection, JPA settings, JWT secrets, Mail & File Storage properties',
    content: `# Server Configuration
server.port=8080
server.servlet.context-path=/

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/smart_management_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=smartuser
spring.datasource.password=SmartPassword123!
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# HikariCP Connection Pool Settings
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.max-lifetime=1200000

# JPA & Hibernate Properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false

# Spring Security & JWT Configurations
smartmanager.app.jwtSecret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
smartmanager.app.jwtExpirationMs=86400000

# Spring Servlet Multipart File Upload Limits
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=./uploads/profile-pictures

# Spring Mail Configurations (SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=noreply@smartmanager.com
spring.mail.password=app-specific-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Springdoc / Swagger OpenAPI Path
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method

# Actuator Endpoints
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always

# Logging Levels
logging.level.root=INFO
logging.level.com.enterprise.smartmanager=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
`,
  },
  {
    filename: 'Dockerfile',
    path: 'Dockerfile',
    language: 'dockerfile',
    description: 'Multi-stage Dockerfile using Maven + Eclipse Temurin JDK 17 for lightweight alpine runtime image',
    content: `# Stage 1: Build the Application
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /app/target/smartmanager-backend-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
`,
  },
  {
    filename: 'docker-compose.yml',
    path: 'docker-compose.yml',
    language: 'yaml',
    description: 'Docker Compose setup with MySQL 8.0, Spring Boot app, and Health Check container orchestration',
    content: `version: '3.8'

services:
  mysql-db:
    image: mysql:8.0
    container_name: smartmanager_mysql
    restart: always
    environment:
      MYSQL_DATABASE: smart_management_db
      MYSQL_USER: smartuser
      MYSQL_PASSWORD: SmartPassword123!
      MYSQL_ROOT_PASSWORD: RootPassword123!
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./src/main/resources/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  spring-backend:
    build: .
    container_name: smartmanager_backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql-db:3306/smart_management_db?useSSL=false&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: smartuser
      SPRING_DATASOURCE_PASSWORD: SmartPassword123!
    depends_on:
      mysql-db:
        condition: service_healthy

volumes:
  mysql_data:
`,
  },
];

export const AUTH_MODULE_JAVA_FILES: CodeFile[] = [
  {
    filename: 'SecurityConfig.java',
    path: 'com.enterprise.smartmanager.security.config.SecurityConfig',
    language: 'java',
    description: 'Spring Security 6.x SecurityFilterChain configuration using Java 17 records & lambda DSL',
    content: `package com.enterprise.smartmanager.security.config;

import com.enterprise.smartmanager.security.jwt.AuthEntryPointJwt;
import com.enterprise.smartmanager.security.jwt.AuthTokenFilter;
import com.enterprise.smartmanager.security.services.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final AuthEntryPointJwt unauthorizedHandler;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService, AuthEntryPointJwt unauthorizedHandler) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
    }

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configure(http))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/public/**").permitAll()
                    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .requestMatchers("/api/manager/**").hasAnyRole("ADMIN", "MANAGER")
                    .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
`,
  },
  {
    filename: 'JwtUtils.java',
    path: 'com.enterprise.smartmanager.security.jwt.JwtUtils',
    language: 'java',
    description: 'Utility for JWT generation, claim parsing, HMAC-SHA256 signature verification and token expiration checks',
    content: `package com.enterprise.smartmanager.security.jwt;

import com.enterprise.smartmanager.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("\${smartmanager.app.jwtSecret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String jwtSecret;

    @Value("\${smartmanager.app.jwtExpirationMs:86400000}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .claim("id", userPrincipal.getId())
                .claim("email", userPrincipal.getEmail())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}
`,
  },
  {
    filename: 'User.java',
    path: 'com.enterprise.smartmanager.entity.User',
    language: 'java',
    description: 'MySQL JPA Entity with Many-To-Many relationship to Roles & Audit metadata',
    content: `package com.enterprise.smartmanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", 
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String username;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String password;

    @NotBlank
    @Size(max = 80)
    @Email
    @Column(nullable = false, length = 80)
    private String email;

    @NotBlank
    @Size(max = 50)
    @Column(name = "first_name", length = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    @Column(name = "last_name", length = 50)
    private String lastName;

    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
`,
  },
  {
    filename: 'Employee.java',
    path: 'com.enterprise.smartmanager.entity.Employee',
    language: 'java',
    description: 'JPA Entity for Employee Records with Department Relationship & Profile Picture field',
    content: `package com.enterprise.smartmanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @Pattern(regexp = "^\\\\+?[1-9]\\\\d{1,14}$", message = "Invalid phone number format")
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
`,
  },
  {
    filename: 'AuditLog.java',
    path: 'com.enterprise.smartmanager.entity.AuditLog',
    language: 'java',
    description: 'JPA Audit Log Entity for System Activity Tracking and Compliance Auditing',
    content: `package com.enterprise.smartmanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs",
    indexes = {
        @Index(name = "idx_audit_user", columnList = "username"),
        @Index(name = "idx_audit_action", columnList = "action"),
        @Index(name = "idx_audit_time", columnList = "timestamp")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(name = "entity_name", length = 50)
    private String entityName;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
`,
  },
  {
    filename: 'AuthController.java',
    path: 'com.enterprise.smartmanager.controller.AuthController',
    language: 'java',
    description: 'Spring Boot REST Controller handling /api/auth/login and /api/auth/register',
    content: `package com.enterprise.smartmanager.controller;

import com.enterprise.smartmanager.dto.request.LoginRequest;
import com.enterprise.smartmanager.dto.request.SignupRequest;
import com.enterprise.smartmanager.dto.response.ApiResponse;
import com.enterprise.smartmanager.dto.response.JwtResponse;
import com.enterprise.smartmanager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication Controller", description = "Endpoints for JWT Authentication, Login, and Registration")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user credentials and generate JWT token")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", jwtResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new employee user account")
    public ResponseEntity<ApiResponse<JwtResponse>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        JwtResponse jwtResponse = authService.register(signUpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("User registered successfully", jwtResponse));
    }
}
`,
  },
  {
    filename: 'EmployeeController.java',
    path: 'com.enterprise.smartmanager.controller.EmployeeController',
    language: 'java',
    description: 'REST Controller for Employee CRUD, Paginated Queries & Search with @PreAuthorize method security',
    content: `package com.enterprise.smartmanager.controller;

import com.enterprise.smartmanager.dto.request.EmployeeRequest;
import com.enterprise.smartmanager.dto.response.ApiResponse;
import com.enterprise.smartmanager.dto.response.EmployeeResponse;
import com.enterprise.smartmanager.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee Directory Controller", description = "Endpoints for managing enterprise employee records")
@SecurityRequirement(name = "bearerAuth")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get paginated list of all employees")
    public ResponseEntity<ApiResponse<Page<EmployeeResponse>>> getAllEmployees(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<EmployeeResponse> employees = employeeService.getEmployees(search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Employees retrieved successfully", employees));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Get employee details by ID")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success("Employee details fetched", employee));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new employee record")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse created = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Employee created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update employee record")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete employee record")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully", null));
    }
}
`,
  },
  {
    filename: 'GlobalExceptionHandler.java',
    path: 'com.enterprise.smartmanager.exception.GlobalExceptionHandler',
    language: 'java',
    description: 'Centralized ControllerAdvice handling Validation exceptions, ResourceNotFoundException, Unauthorized & General Errors',
    content: `package com.enterprise.smartmanager.exception;

import com.enterprise.smartmanager.dto.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        logger.error("Resource Not Found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        logger.warn("Validation failed for request: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(), "Validation Failed", errors));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(BadCredentialsException ex) {
        logger.warn("Bad credentials attempt: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(AccessDeniedException ex) {
        logger.warn("Access Denied: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(HttpStatus.FORBIDDEN.value(), "Access Denied: You do not have permission for this resource"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
        logger.error("Unhandled Exception: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected server error occurred. Please contact system admin."));
    }
}
`,
  },
  {
    filename: 'EmailService.java',
    path: 'com.enterprise.smartmanager.service.EmailService',
    language: 'java',
    description: 'Asynchronous Email Service sending HTML notifications for onboarding, password resets & status updates',
    content: `package com.enterprise.smartmanager.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String fullName, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Welcome to Enterprise Smart Manager Portal");

            String htmlBody = "<html>"
                    + "<body style='font-family: Arial, sans-serif; color: #333;'>"
                    + "<div style='background: #0078D4; padding: 20px; color: white;'>"
                    + "<h2>Welcome to Smart Manager, " + fullName + "!</h2>"
                    + "</div>"
                    + "<div style='padding: 20px; border: 1px solid #ddd;'>"
                    + "<p>Your account has been successfully created.</p>"
                    + "<p><b>Username:</b> " + username + "</p>"
                    + "<p>Please log in and complete your employee profile setup.</p>"
                    + "</div>"
                    + "</body>"
                    + "</html>";

            helper.setText(htmlBody, true);
            mailSender.send(message);
            logger.info("Welcome email successfully sent to {}", toEmail);
        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }
}
`,
  },
];

export const TEST_MODULE_JAVA_FILES: CodeFile[] = [
  {
    filename: 'EmployeeServiceTest.java',
    path: 'src/test/java/com/enterprise/smartmanager/service/EmployeeServiceTest.java',
    language: 'java',
    description: 'Unit tests for EmployeeService using JUnit 5, Mockito (@Mock, @InjectMocks) and AssertJ assertions',
    content: `package com.enterprise.smartmanager.service;

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
`,
  },
  {
    filename: 'AuthControllerTest.java',
    path: 'src/test/java/com/enterprise/smartmanager/controller/AuthControllerTest.java',
    language: 'java',
    description: 'Integration test using @WebMvcTest & MockMvc to test REST endpoints, JSON serialization & HTTP 200/401 status codes',
    content: `package com.enterprise.smartmanager.controller;

import com.enterprise.smartmanager.dto.request.LoginRequest;
import com.enterprise.smartmanager.dto.response.JwtResponse;
import com.enterprise.smartmanager.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @WithMockUser
    void login_Success_Returns200AndJwtToken() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "AdminPassword123!");
        JwtResponse jwtResponse = new JwtResponse("mock_token_xyz", "Bearer", 1L, "admin", "admin@enterprise.com", List.of("ROLE_ADMIN"));

        when(authService.login(any(LoginRequest.class))).thenReturn(jwtResponse);

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").value("mock_token_xyz"))
                .andExpect(jsonPath("$.data.username").value("admin"));
    }
}
`,
  },
];

export const DATABASE_AND_DOCS_FILES: CodeFile[] = [
  {
    filename: 'schema.sql',
    path: 'src/main/resources/db/schema.sql',
    language: 'sql',
    description: 'MySQL 8.0 DDL Database Script creating relational tables, foreign key constraints, indexes & audit triggers',
    content: `-- Enterprise Smart Manager ERP — MySQL 8.0 DDL Database Schema Script
CREATE DATABASE IF NOT EXISTS smartmanager_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartmanager_db;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 3. User Roles Mapping
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Employees Table
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

-- 5. Audit Logs Table
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
`,
  },
  {
    filename: 'data.sql',
    path: 'src/main/resources/db/data.sql',
    language: 'sql',
    description: 'MySQL 8.0 DML Initial Seed Script inserting default enterprise users, roles, and employee records',
    content: `-- Initial DML Data Seed Script
USE smartmanager_db;

-- Insert Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_MANAGER') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (3, 'ROLE_EMPLOYEE') ON DUPLICATE KEY UPDATE name=name;

-- Insert Default Admin User (Password: AdminPassword123! hashed via BCrypt)
INSERT INTO users (id, username, email, password_hash, first_name, last_name, department, designation, enabled)
VALUES (1, 'admin', 'admin@enterprise.com', '$2a$10$e7W8o9YvN0bYkY/m0v.h1.d9b/2u8g1Z/x3l7p2q8r5t0v1w2y3z4', 'Alex', 'Vance', 'Executive Engineering', 'Principal Enterprise Architect', TRUE)
ON DUPLICATE KEY UPDATE username=username;

-- Assign Admin Role
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1) ON DUPLICATE KEY UPDATE user_id=user_id;

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
`,
# Please note that the target line range was [1181, 1184].
StartLine:1181,TargetContent:
`,
  },
  {
    filename: 'SmartManager_API.postman_collection.json',
    path: 'docs/postman/SmartManager_API.postman_collection.json',
    language: 'json',
    description: 'Complete Postman Collection with pre-script JWT token extraction, endpoints & response schemas',
    content: `{
  "info": {
    "name": "Smart Manager Enterprise REST API",
    "description": "Complete Postman API Collection for Spring Boot 3 ERP Application",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Auth Module",
      "item": [
        {
          "name": "POST /api/auth/login",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"username\\": \\"admin\\",\\n  \\"password\\": \\"AdminPassword123!\\"\\n}"
            },
            "url": { "raw": "{{baseUrl}}/api/auth/login" }
          }
        },
        {
          "name": "POST /api/auth/refresh-token",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"refreshToken\\": \\"{{refreshToken}}\\"\\n}"
            },
            "url": { "raw": "{{baseUrl}}/api/auth/refresh-token" }
          }
        }
      ]
    },
    {
      "name": "2. Employee Management",
      "item": [
        {
          "name": "GET /api/employees",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer {{jwtToken}}" }
            ],
            "url": { "raw": "{{baseUrl}}/api/employees?department=Software Engineering" }
          }
        },
        {
          "name": "POST /api/employees",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{jwtToken}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"employeeCode\\": \\"EMP-1009\\",\\n  \\"firstName\\": \\"David\\",\\n  \\"lastName\\": \\"Miller\\",\\n  \\"email\\": \\"d.miller@enterprise.com\\",\\n  \\"department\\": \\"Quality Assurance\\",\\n  \\"designation\\": \\"Senior QA Lead\\",\\n  \\"salary\\": 115000,\\n  \\"hireDate\\": \\"2024-05-01\\"\\n}"
            },
            "url": { "raw": "{{baseUrl}}/api/employees" }
          }
        }
      ]
    },
    {
      "name": "3. Audit & Compliance",
      "item": [
        {
          "name": "GET /api/audit-logs",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer {{jwtToken}}" }
            ],
            "url": { "raw": "{{baseUrl}}/api/audit-logs" }
          }
        }
      ]
    }
  ]
}
`,
  },
];

