import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  Project,
  Task,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  AuditLog,
  NotificationItem,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import { apiEvents, SnackbarNotification } from '../services/api';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

interface DataContextType {
  // Global API Loading State
  isApiLoading: boolean;

  // Employees
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: number, emp: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;

  // Projects
  projects: Project[];
  addProject: (prj: Omit<Project, 'id'>) => void;
  updateProject: (id: number, prj: Partial<Project>) => void;
  deleteProject: (id: number) => void;

  // Tasks
  tasks: Task[];
  addTask: (tsk: Omit<Task, 'id'>) => void;
  updateTask: (id: number, tsk: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  updateTaskStatus: (id: number, status: Task['status']) => void;

  // Attendance
  attendance: AttendanceRecord[];
  checkIn: (employeeId: number, employeeName: string) => void;
  checkOut: (employeeId: number) => void;

  // Leaves
  leaves: LeaveRequest[];
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => void;
  approveLeaveRequest: (id: number, approvedBy: string) => void;
  rejectLeaveRequest: (id: number) => void;

  // Payroll
  payrolls: PayrollRecord[];
  processPayroll: (id: number) => void;
  markPayrollPaid: (id: number) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, entityName: string, entityId: number, details: string) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  markNotificationRead: (id: number) => void;
  clearNotifications: () => void;

  // Global Snackbar
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity?: SnackbarState['severity']) => void;
  hideSnackbar: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isApiLoading, setIsApiLoading] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('smart_employees_v4');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('smart_projects_v3');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('smart_tasks_v3');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('smart_attendance_v3');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('smart_leaves_v3');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('smart_payrolls_v3');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('smart_audit_logs_v3');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('smart_notifications_v3');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: 'Welcome to Enterprise Smart Manager',
        message: 'Your profile has been synchronized with the main executive directory.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        read: false,
        type: 'SYSTEM',
      },
      {
        id: 2,
        title: 'Docker Environment Healthy',
        message: 'Backend services and MySQL 8.0 instance are up and running.',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        read: true,
        type: 'SYSTEM',
      }
    ];
  });

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Subscribe to Axios API event bus for global loading indicators and error notifications
  useEffect(() => {
    const unsubLoading = apiEvents.subscribeLoading((loading) => {
      setIsApiLoading(loading);
    });

    const unsubSnackbar = apiEvents.subscribeSnackbar(({ message, severity }: SnackbarNotification) => {
      setSnackbar({ open: true, message, severity });
    });

    return () => {
      unsubLoading();
      unsubSnackbar();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smart_employees_v4', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('smart_projects_v3', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('smart_tasks_v3', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('smart_attendance_v3', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('smart_leaves_v3', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('smart_payrolls_v3', JSON.stringify(payrolls));
  }, [payrolls]);

  useEffect(() => {
    localStorage.setItem('smart_audit_logs_v3', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('smart_notifications_v3', JSON.stringify(notifications));
  }, [notifications]);

  // Recalculate project progress based on tasks progress/status
  useEffect(() => {
    if (tasks.length === 0) return;

    // Group tasks by projectId
    const tasksByProject: { [projectId: number]: Task[] } = {};
    tasks.forEach((t) => {
      if (!tasksByProject[t.projectId]) {
        tasksByProject[t.projectId] = [];
      }
      tasksByProject[t.projectId].push(t);
    });

    // Update projects state
    setProjects((prevProjects) => {
      let changed = false;
      const updatedProjects = prevProjects.map((p) => {
        const projTasks = tasksByProject[p.id];
        if (projTasks && projTasks.length > 0) {
          const totalProgress = projTasks.reduce((sum, t) => {
            if (t.progress !== undefined) {
              return sum + t.progress;
            }
            switch (t.status) {
              case 'COMPLETED': return sum + 100;
              case 'IN_REVIEW': return sum + 75;
              case 'IN_PROGRESS': return sum + 50;
              default: return sum + 0;
            }
          }, 0);
          const computedProgress = Math.round(totalProgress / projTasks.length);
          if (p.progressPercentage !== computedProgress) {
            changed = true;
            return { ...p, progressPercentage: computedProgress };
          }
        }
        return p;
      });

      return changed ? updatedProjects : prevProjects;
    });
  }, [tasks]);

  const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const addAuditLog = (action: string, entityName: string, entityId: number, details: string) => {
    const newLog: AuditLog = {
      id: Date.now(),
      username: localStorage.getItem('smart_jwt_user')
        ? JSON.parse(localStorage.getItem('smart_jwt_user')!).username
        : 'system',
      action,
      entityName,
      entityId,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'SYSTEM') => {
    const newNotif: NotificationItem = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showSnackbar(`${title}: ${message}`, 'info');
  };

  const markNotificationRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Employee CRUD
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = { ...emp, id: Date.now() };
    setEmployees((prev) => [newEmp, ...prev]);
    showSnackbar(`Employee ${newEmp.firstName} ${newEmp.lastName} created successfully!`, 'success');
    addAuditLog('EMPLOYEE_CREATE', 'Employee', newEmp.id, `Added employee ${newEmp.employeeCode}`);
  };

  const updateEmployee = (id: number, empData: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...empData } : e)));
    showSnackbar('Employee record updated successfully', 'success');
    addAuditLog('EMPLOYEE_UPDATE', 'Employee', id, 'Updated employee profile details');
  };

  const deleteEmployee = (id: number) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showSnackbar(`Employee ${target?.firstName || ''} removed`, 'info');
    addAuditLog('EMPLOYEE_DELETE', 'Employee', id, `Deleted employee record ID ${id}`);
  };

  // Project CRUD
  const addProject = (prj: Omit<Project, 'id'>) => {
    const newPrj: Project = { ...prj, id: Date.now() };
    setProjects((prev) => [newPrj, ...prev]);
    showSnackbar(`Project "${newPrj.name}" created`, 'success');
    addAuditLog('PROJECT_CREATE', 'Project', newPrj.id, `Created project ${newPrj.projectCode}`);
  };

  const updateProject = (id: number, prjData: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...prjData } : p)));
    showSnackbar('Project updated successfully', 'success');
    addAuditLog('PROJECT_UPDATE', 'Project', id, 'Updated project attributes');
  };

  const deleteProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showSnackbar('Project deleted', 'info');
    addAuditLog('PROJECT_DELETE', 'Project', id, `Deleted project ID ${id}`);
  };

  // Task CRUD
  const addTask = (tsk: Omit<Task, 'id'>) => {
    const newTsk: Task = { ...tsk, id: Date.now() };
    setTasks((prev) => [newTsk, ...prev]);
    showSnackbar(`Task "${newTsk.title}" assigned`, 'success');
    addAuditLog('TASK_CREATE', 'Task', newTsk.id, `Created task ${newTsk.taskCode}`);
  };

  const updateTask = (id: number, tskData: Partial<Task>) => {
    let taskCode = '';
    let title = '';
    let assigneeName = '';
    let oldStatus: Task['status'] = 'TO_DO';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          taskCode = t.taskCode;
          title = t.title;
          assigneeName = t.assigneeName;
          oldStatus = t.status;

          // Sync progress and status if one is updated without the other
          let status = tskData.status !== undefined ? tskData.status : t.status;
          let progress = tskData.progress !== undefined ? tskData.progress : t.progress;

          if (tskData.status !== undefined && tskData.progress === undefined) {
            if (status === 'COMPLETED') progress = 100;
            else if (status === 'TO_DO') progress = 0;
          } else if (tskData.progress !== undefined && tskData.status === undefined) {
            if (progress === 100) status = 'COMPLETED';
            else if (progress > 0 && progress < 100 && status === 'TO_DO') status = 'IN_PROGRESS';
          }

          return { ...t, ...tskData, status, progress };
        }
        return t;
      })
    );

    const isNowCompleted = tskData.status === 'COMPLETED' || (tskData.progress === 100 && oldStatus !== 'COMPLETED');
    if (isNowCompleted && oldStatus !== 'COMPLETED') {
      addAuditLog('TASK_COMPLETED', 'Task', id, `Task ${taskCode} ("${title}") completed by ${assigneeName}`);
      addNotification('Task Completed', `Task ${taskCode} ("${title}") has been marked COMPLETED by ${assigneeName}.`, 'TASK');
    } else {
      addAuditLog('TASK_UPDATE', 'Task', id, `Updated task properties for ${taskCode}`);
    }
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showSnackbar('Task removed', 'info');
  };

  const updateTaskStatus = (id: number, status: Task['status']) => {
    let taskCode = '';
    let title = '';
    let assigneeName = '';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          taskCode = t.taskCode;
          title = t.title;
          assigneeName = t.assigneeName;
          let newProgress = t.progress;
          if (status === 'COMPLETED') {
            newProgress = 100;
          } else if (status === 'TO_DO') {
            newProgress = 0;
          } else if (status === 'IN_PROGRESS' && (t.progress === 0 || t.progress === 100 || !t.progress)) {
            newProgress = 50;
          }
          return { ...t, status, progress: newProgress };
        }
        return t;
      })
    );

    if (status === 'COMPLETED') {
      addAuditLog('TASK_COMPLETED', 'Task', id, `Task ${taskCode} ("${title}") completed by ${assigneeName}`);
      addNotification('Task Completed', `Task ${taskCode} ("${title}") has been marked COMPLETED by ${assigneeName}.`, 'TASK');
    } else {
      addAuditLog('TASK_STATUS_CHANGE', 'Task', id, `Changed status of ${taskCode} to ${status}`);
    }
  };

  // Attendance
  const checkIn = (employeeId: number, employeeName: string) => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === today);
    if (existing) {
      showSnackbar('Already checked in for today!', 'warning');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now(),
      employeeId,
      employeeName,
      date: today,
      checkInTime: timeNow,
      checkOutTime: '-',
      totalHours: 0,
      status: 'PRESENT',
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
    };

    setAttendance((prev) => [newRecord, ...prev]);
    showSnackbar(`Checked in successfully at ${timeNow}!`, 'success');
    addAuditLog('ATTENDANCE_CHECKIN', 'AttendanceRecord', newRecord.id, `${employeeName} checked in`);
  };

  const checkOut = (employeeId: number) => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance((prev) =>
      prev.map((a) => {
        if (a.employeeId === employeeId && a.date === today && a.checkOutTime === '-') {
          return { ...a, checkOutTime: timeNow, totalHours: 8.5 };
        }
        return a;
      })
    );
    showSnackbar(`Checked out successfully at ${timeNow}!`, 'info');
  };

  // Leaves
  const addLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: Date.now(),
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setLeaves((prev) => [newReq, ...prev]);
    showSnackbar('Leave request submitted to Manager for approval', 'success');
    addAuditLog('LEAVE_REQUEST', 'LeaveRequest', newReq.id, `Requested ${req.leaveType} leave`);
  };

  const approveLeaveRequest = (id: number, approvedBy: string) => {
    let empName = '';
    let leaveType = '';
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          empName = l.employeeName;
          leaveType = l.leaveType;
          return { ...l, status: 'APPROVED', approvedBy };
        }
        return l;
      })
    );
    showSnackbar('Leave request approved', 'success');
    addAuditLog('LEAVE_APPROVED', 'LeaveRequest', id, `Approved leave for ${empName}`);
    addNotification('Leave Approved', `${leaveType} leave request for ${empName} has been APPROVED by ${approvedBy}.`, 'LEAVE');
  };

  const rejectLeaveRequest = (id: number) => {
    let empName = '';
    let leaveType = '';
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          empName = l.employeeName;
          leaveType = l.leaveType;
          return { ...l, status: 'REJECTED' };
        }
        return l;
      })
    );
    showSnackbar('Leave request rejected', 'warning');
    addAuditLog('LEAVE_REJECTED', 'LeaveRequest', id, `Rejected leave for ${empName}`);
    addNotification('Leave Rejected', `${leaveType} leave request for ${empName} has been REJECTED.`, 'LEAVE');
  };

  // Payroll
  const processPayroll = (id: number) => {
    setPayrolls((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'PROCESSED' } : p)));
    showSnackbar('Payroll calculated and PROCESSED', 'success');
  };

  const markPayrollPaid = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setPayrolls((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'PAID', paymentDate: today } : p)));
    showSnackbar('Payroll status marked as PAID', 'success');
  };

  return (
    <DataContext.Provider
      value={{
        isApiLoading,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,

        projects,
        addProject,
        updateProject,
        deleteProject,

        tasks,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,

        attendance,
        checkIn,
        checkOut,

        leaves,
        addLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,

        payrolls,
        processPayroll,
        markPayrollPaid,

        auditLogs,
        addAuditLog,

        notifications,
        addNotification,
        markNotificationRead,
        clearNotifications,
        snackbar,
        showSnackbar,
        hideSnackbar,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
