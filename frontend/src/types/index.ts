export type RoleType = 'ADMIN' | 'EMPLOYEE';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'User Management' | 'Employee Data' | 'Project Management' | 'Payroll' | 'System Config';
}

export interface Role {
  id: number;
  name: RoleType;
  description: string;
  permissions: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  roles: RoleType[];
  department?: string;
  designation?: string;
  employeeCode?: string;
  enabled: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface JwtResponse {
  token: string;
  refreshToken?: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: RoleType[];
  expiresIn: number;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
  errors?: string[];
}

export interface SystemHealth {
  status: 'UP' | 'DOWN';
  components: {
    db: { status: 'UP'; details: { database: 'MySQL 8.0'; validationQuery: 'SELECT 1' } };
    diskSpace: { status: 'UP'; details: { total: string; free: string; threshold: string } };
    ping: { status: 'UP' };
    springSecurity: { status: 'ACTIVE'; jwtExpirationMs: number };
  };
}

export interface CodeFile {
  filename: string;
  path: string;
  language: 'java' | 'sql' | 'xml' | 'yaml' | 'json' | 'properties' | 'dockerfile';
  content: string;
  description: string;
}

// Enterprise Employee Entity
export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  hireDate: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  profilePictureUrl?: string;
  skills?: string[];
}

// Enterprise Project Entity
export interface Project {
  id: number;
  projectCode: string;
  name: string;
  clientName: string;
  description: string;
  department: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
  teamLead: string;
  memberCount: number;
  progressPercentage: number;
}

// Task Management Entity
export interface Task {
  id: number;
  taskCode: string;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  assigneeId: number;
  assigneeName: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'TO_DO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress?: number;
  remarks?: string;
}

// Attendance Entity
export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  totalHours: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';
  ipAddress: string;
}

// Leave Request Entity
export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'CASUAL' | 'SICK' | 'EARNED' | 'MATERNITY' | 'PATERNITY';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  approvedBy?: string;
}

// Payroll Entity
export interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  designation: string;
  department: string;
  month: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'DRAFT' | 'PROCESSED' | 'PAID';
  paymentDate?: string;
}

// System Audit Log Entity
export interface AuditLog {
  id: number;
  username: string;
  action: string;
  entityName: string;
  entityId: number;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'TASK' | 'LEAVE' | 'PAYROLL' | 'SYSTEM';
}
