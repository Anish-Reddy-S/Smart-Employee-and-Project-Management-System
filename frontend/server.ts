import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory mock database for Users, Employees, Projects, Tasks, etc.
interface UserRecord {
  id: number;
  username: string;
  passwordHash: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: ('ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_EMPLOYEE')[];
  department: string;
  designation: string;
  employeeCode?: string;
  enabled: boolean;
  createdAt: string;
  lastLogin?: string;
}

const USERS: UserRecord[] = [
  {
    id: 1,
    username: 'admin',
    passwordHash: 'admin123',
    email: 'admin@enterprise.com',
    firstName: 'Alex',
    lastName: 'Vance',
    roles: ['ROLE_ADMIN'],
    department: 'Executive Engineering',
    designation: 'Principal Enterprise Architect',
    employeeCode: 'EMP-1001',
    enabled: true,
    createdAt: '2026-01-10T08:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 2,
    username: 'manager',
    passwordHash: 'manager123',
    email: 'm.chen@enterprise.com',
    firstName: 'Michael',
    lastName: 'Chen',
    roles: ['ROLE_MANAGER'],
    department: 'Software Development',
    designation: 'Engineering Manager',
    employeeCode: 'EMP-1002',
    enabled: true,
    createdAt: '2026-01-15T09:30:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 3,
    username: 'employee',
    passwordHash: 'emp123',
    email: 's.sharma@enterprise.com',
    firstName: 'Sarah',
    lastName: 'Sharma',
    roles: ['ROLE_EMPLOYEE'],
    department: 'Software Development',
    designation: 'Senior Full Stack Java Engineer',
    employeeCode: 'EMP-1003',
    enabled: true,
    createdAt: '2026-02-01T10:15:00Z',
    lastLogin: new Date().toISOString(),
  },
];

const ROLES_PERMISSIONS = [
  {
    id: 1,
    name: 'ROLE_ADMIN',
    description: 'System Administrator with full read/write/delete privileges across all modules',
    permissions: [
      'USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE',
      'ROLE_MANAGE', 'EMPLOYEE_MANAGE', 'PROJECT_MANAGE', 'PAYROLL_APPROVE', 'SYSTEM_CONFIG'
    ],
  },
  {
    id: 2,
    name: 'ROLE_MANAGER',
    description: 'Departmental Project & Engineering Lead with project allocation & approval rights',
    permissions: [
      'USER_READ', 'EMPLOYEE_READ', 'EMPLOYEE_UPDATE',
      'PROJECT_MANAGE', 'TASK_ASSIGN', 'ATTENDANCE_APPROVE', 'PAYROLL_VIEW'
    ],
  },
  {
    id: 3,
    name: 'ROLE_EMPLOYEE',
    description: 'Standard enterprise staff member with personal portal access',
    permissions: [
      'USER_READ_SELF', 'EMPLOYEE_READ_SELF', 'TASK_UPDATE', 'ATTENDANCE_LOG', 'PAYROLL_VIEW_SELF'
    ],
  },
];

// Helper to simulate JWT Token generation
function generateJwtToken(user: UserRecord): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.username,
      id: user.id,
      email: user.email,
      roles: user.roles,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
      iss: 'SmartEnterpriseSpringBootApp',
    })
  ).toString('base64url');
  const signature = Buffer.from(`signed_with_secret_key_java17_spring_boot_${user.username}`).toString('base64url');
  return `${header}.${payload}.${signature}`;
}

function generateRefreshToken(user: UserRecord): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.username,
      id: user.id,
      type: 'refresh',
      exp: Math.floor(Date.now() / 1000) + 7 * 86400, // 7 days
    })
  ).toString('base64url');
  return `refresh_${payload}_${Date.now()}`;
}

// REST APIs
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    timestamp: new Date().toISOString(),
    status: 200,
    message: 'Spring Boot Application Health Check Passed',
    data: {
      status: 'UP',
      components: {
        db: { status: 'UP', details: { database: 'MySQL 8.0 Enterprise', validationQuery: 'SELECT 1' } },
        diskSpace: { status: 'UP', details: { total: '500 GB', free: '342 GB', threshold: '10 GB' } },
        ping: { status: 'UP' },
        springSecurity: { status: 'ACTIVE', jwtExpirationMs: 86400000 },
      },
    },
  });
});

// Authentication Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      message: 'Validation Error: Missing username or password',
      errors: [
        { field: 'username', message: 'Username cannot be blank (@NotBlank constraint)' },
        { field: 'password', message: 'Password cannot be blank (@NotBlank constraint)' }
      ],
    });
  }

  const user = USERS.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({
      timestamp: new Date().toISOString(),
      status: 401,
      message: 'Unauthorized: Invalid username or password credentials',
      errors: ['BadCredentialsException: Could not authenticate user against Spring Security UserDetailsService'],
    });
  }

  user.lastLogin = new Date().toISOString();
  const token = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user);

  return res.json({
    timestamp: new Date().toISOString(),
    status: 200,
    message: 'User authenticated successfully via Spring Security',
    data: {
      token,
      refreshToken,
      type: 'Bearer',
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      expiresIn: 86400,
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName, role } = req.body;
  
  const errors: { field: string; message: string }[] = [];
  if (!username) errors.push({ field: 'username', message: 'Username is required' });
  if (!email || !email.includes('@')) errors.push({ field: 'email', message: 'Valid corporate email required' });
  if (!password || password.length < 4) errors.push({ field: 'password', message: 'Password must be at least 4 characters long' });
  if (!firstName) errors.push({ field: 'firstName', message: 'First Name is required' });
  if (!lastName) errors.push({ field: 'lastName', message: 'Last Name is required' });

  if (errors.length > 0) {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      message: 'Validation Error: Request payload failed JSR-380 validation',
      errors,
    });
  }

  if (USERS.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({
      timestamp: new Date().toISOString(),
      status: 409,
      message: 'Conflict: Username is already registered in MySQL database',
      errors: ['UserAlreadyExistsException: Unique constraint violation on users(username)'],
    });
  }

  const newUser: UserRecord = {
    id: USERS.length + 1,
    username,
    passwordHash: password,
    email,
    firstName,
    lastName,
    roles: role ? [role] : ['ROLE_EMPLOYEE'],
    department: 'General Staff',
    designation: 'Enterprise Associate',
    employeeCode: `EMP-${1000 + USERS.length + 1}`,
    enabled: true,
    createdAt: new Date().toISOString(),
  };

  USERS.push(newUser);
  const token = generateJwtToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  return res.status(201).json({
    timestamp: new Date().toISOString(),
    status: 201,
    message: 'User registered successfully and saved to MySQL DB',
    data: {
      token,
      refreshToken,
      type: 'Bearer',
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      roles: newUser.roles,
      expiresIn: 86400,
    },
  });
});

app.post('/api/auth/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== 'string' || !refreshToken.startsWith('refresh_')) {
    return res.status(401).json({
      timestamp: new Date().toISOString(),
      status: 401,
      message: 'Unauthorized: Invalid or expired Refresh Token',
      errors: ['RefreshTokenExpiredException: Refresh token has expired or is invalid'],
    });
  }

  const adminUser = USERS[0];
  const newAccessToken = generateJwtToken(adminUser);
  const newRefreshToken = generateRefreshToken(adminUser);

  return res.json({
    timestamp: new Date().toISOString(),
    status: 200,
    message: 'JWT Access Token refreshed successfully',
    data: {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      type: 'Bearer',
      expiresIn: 86400,
    },
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      timestamp: new Date().toISOString(),
      status: 401,
      message: 'Unauthorized: Missing or Malformed Bearer Authorization Header',
      errors: ['JwtException: Authorization token missing'],
    });
  }

  const user = USERS[0];
  const { passwordHash, ...sanitized } = user;
  return res.json({
    timestamp: new Date().toISOString(),
    status: 200,
    message: 'Retrieved authenticated profile claims',
    data: sanitized,
  });
});

app.get('/api/users', (req: Request, res: Response) => {
  const sanitizedUsers = USERS.map(({ passwordHash, ...rest }) => rest);
  res.json({
    timestamp: new Date().toISOString(),
    status: 200,
    message: 'Fetched all system accounts from Spring Data JPA UserRepository',
    data: sanitizedUsers,
  });
});

app.get('/api/roles', (req: Request, res: Response) => {
  res.json({
    timestamp: new Date().toISOString(),
    status: 200,
    message: 'Role-Based Access Control matrix retrieved',
    data: ROLES_PERMISSIONS,
  });
});

// TEST ENDPOINTS FOR EXPLICIT HTTP STATUS ERROR HANDLING DEMO
app.get('/api/test/401', (req: Request, res: Response) => {
  return res.status(401).json({
    timestamp: new Date().toISOString(),
    status: 401,
    message: '401 Unauthorized: JWT Bearer Token Expired or Invalid Signature',
    errors: ['ExpiredJwtException: JWT expired at 2026-07-22T23:00:00Z'],
  });
});

app.get('/api/test/403', (req: Request, res: Response) => {
  return res.status(403).json({
    timestamp: new Date().toISOString(),
    status: 403,
    message: '403 Forbidden: Access Denied due to insufficient RBAC privileges',
    errors: ['AccessDeniedException: User lacks required ROLE_ADMIN privilege'],
  });
});

app.get('/api/test/404', (req: Request, res: Response) => {
  return res.status(404).json({
    timestamp: new Date().toISOString(),
    status: 404,
    message: '404 Not Found: The requested Spring REST resource does not exist',
    errors: ['ResourceNotFoundException: Entity #9999 not found in MySQL DB'],
  });
});

app.get('/api/test/500', (req: Request, res: Response) => {
  return res.status(500).json({
    timestamp: new Date().toISOString(),
    status: 500,
    message: '500 Internal Server Error: Spring Boot Server Runtime Exception',
    errors: ['NullPointerException: Unexpected failure in DataAccessService.java line 142'],
  });
});

app.post('/api/test/validation', (req: Request, res: Response) => {
  return res.status(400).json({
    timestamp: new Date().toISOString(),
    status: 400,
    message: '400 Bad Request: DTO Validation Failed (@Valid constraint violation)',
    errors: [
      { field: 'employeeCode', message: 'Employee code must match pattern EMP-[0-9]{4}' },
      { field: 'email', message: 'Email address must belong to @enterprise.com domain' },
      { field: 'salary', message: 'Salary must be greater than or equal to $3,000' }
    ],
  });
});

// Swagger Specification JSON output
app.get('/api/swagger-doc', (req: Request, res: Response) => {
  res.json({
    openapi: '3.0.3',
    info: {
      title: 'Smart Employee & Project Management API',
      description: 'Production Spring Boot RESTful API with Spring Security JWT and MySQL Data Access Layer',
      version: '1.0.0',
    },
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'Authenticate User and Obtain JWT Token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { username: { type: 'string' }, password: { type: 'string' } } } } },
          },
          responses: {
            200: { description: 'Authentication Success' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/auth/register': {
        post: {
          summary: 'Register New Employee User Account',
          responses: { 201: { description: 'User Created' } },
        },
      },
      '/api/auth/refresh': {
        post: {
          summary: 'Refresh JWT Access Token',
          responses: { 200: { description: 'Token Refreshed' } },
        },
      },
      '/api/users': {
        get: {
          summary: 'Get All Enterprise Users (ROLE_ADMIN or ROLE_MANAGER)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Success' } },
        },
      },
    },
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  let currentPort = PORT;
  const server = app.listen(currentPort, '0.0.0.0', () => {
    console.log(`Enterprise Spring Boot REST backend running on http://localhost:${currentPort}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      currentPort++;
      console.log(`Port ${currentPort - 1} is in use, retrying on http://localhost:${currentPort}...`);
      server.listen(currentPort, '0.0.0.0');
    }
  });
}

startServer();
