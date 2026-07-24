import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  AccessTime as AttendanceIcon,
  EventNote as LeaveIcon,
  Payments as PayrollIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Print as PrintIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PayrollRecord } from '../../types';
import { generatePayslipPDF, exportToCSV, exportToPDF } from '../../utils/exportUtils';

export const ReportsModuleView: React.FC = () => {
  const theme = useTheme();
  const {
    attendance,
    checkIn,
    checkOut,
    leaves,
    addLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    payrolls,
    markPayrollPaid,
    projects,
    tasks,
    employees,
  } = useData();

  const { user, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [subReportTab, setSubReportTab] = useState<'project' | 'employee' | 'pending'>('project');
  const [selectedReportEmpId, setSelectedReportEmpId] = useState<number>(employees[0]?.id || 1);

  // Leave Request Dialog
  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    employeeId: user?.id || 1,
    employeeName: user ? `${user.firstName} ${user.lastName}` : 'Alex Vance',
    leaveType: 'CASUAL_LEAVE',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: 'Personal time off for family event.',
  });

  // Payslip Modal
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [openPayslipModal, setOpenPayslipModal] = useState(false);

  const handleCreateLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    addLeaveRequest(leaveForm as any);
    setOpenLeaveModal(false);
  };

  const handleOpenPayslip = (p: PayrollRecord) => {
    setSelectedPayroll(p);
    setOpenPayslipModal(false);
    setTimeout(() => setOpenPayslipModal(true), 50);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title Banner */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <AttendanceIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {activeRole === 'EMPLOYEE' ? 'My History & Statements' : 'Attendance, Leaves & Payroll'}
            </Typography>
            <Chip
              label={activeRole === 'EMPLOYEE' ? 'EMPLOYEE PORTAL' : 'ENTERPRISE AUDIT'}
              color="info"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.62rem', height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {activeRole === 'EMPLOYEE'
              ? 'View your past attendance logs, leave requests, and payroll statements.'
              : 'Daily time logs, automated check-in/out, leave request approval workflow & salary pay slip generator.'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {activeRole !== 'EMPLOYEE' && activeTab === 0 && (
            <Button
              variant="contained"
              color="success"
              startIcon={<AttendanceIcon />}
              onClick={() => checkIn(user?.id || 1, user ? `${user.firstName} ${user.lastName}` : 'Alex Vance')}
              sx={{ fontWeight: 700 }}
            >
              Quick Check-In Today
            </Button>
          )}

          {activeRole !== 'EMPLOYEE' && activeTab === 1 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenLeaveModal(true)}
            >
              Apply Leave Request
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Card variant="outlined" sx={{ borderRadius: 1.5, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            px: 2,
            pt: 1,
          }}
        >
          <Tab icon={<AttendanceIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={activeRole === 'EMPLOYEE' ? 'My Attendance Logs' : 'Daily Attendance Logs'} />
          <Tab icon={<LeaveIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={activeRole === 'EMPLOYEE' ? 'My Leave Requests' : 'Leave Requests & Approvals'} />
          <Tab icon={<PayrollIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={activeRole === 'EMPLOYEE' ? 'My Payroll & Payslips' : 'Payroll & Payslip Statements'} />
          {activeRole !== 'EMPLOYEE' && (
            <Tab icon={<AssessmentIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Project & Task Analytics Reports" />
          )}
        </Tabs>


        <Box sx={{ p: 3 }}>
          {/* TAB 0: ATTENDANCE LOGS */}
          {activeTab === 0 && (
            <Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      {activeRole !== 'EMPLOYEE' && <TableCell>Employee Name</TableCell>}
                      <TableCell>Check-In Time</TableCell>
                      <TableCell>Check-Out Time</TableCell>
                      <TableCell>Total Work Hours</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>IP Address</TableCell>
                      {activeRole !== 'EMPLOYEE' && <TableCell align="right">Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(activeRole === 'EMPLOYEE'
                      ? attendance.filter((a) => a.employeeId === (user?.id || 1) || a.employeeName.includes(user?.firstName || 'Alex'))
                      : attendance
                    ).map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{a.date}</TableCell>
                        {activeRole !== 'EMPLOYEE' && <TableCell sx={{ fontWeight: 600 }}>{a.employeeName}</TableCell>}
                        <TableCell sx={{ color: 'success.main', fontWeight: 700 }}>{a.checkInTime}</TableCell>
                        <TableCell sx={{ color: 'error.main', fontWeight: 700 }}>{a.checkOutTime}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{a.totalHours} hrs</TableCell>
                        <TableCell>
                          <Chip
                            label={a.status}
                            size="small"
                            color={a.status === 'PRESENT' ? 'success' : a.status === 'LATE' ? 'warning' : 'error'}
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                          />
                        </TableCell>
                        <TableCell><code>{a.ipAddress}</code></TableCell>
                        {activeRole !== 'EMPLOYEE' && (
                          <TableCell align="right">
                            {a.checkOutTime === '-' && (
                              <Button size="small" variant="outlined" color="warning" onClick={() => checkOut(a.employeeId)}>
                                Check-Out
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 1: LEAVE REQUESTS */}
          {activeTab === 1 && (
            <Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Applied Date</TableCell>
                      {activeRole !== 'EMPLOYEE' && <TableCell>Employee</TableCell>}
                      <TableCell>Leave Type</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">
                        {activeRole === 'EMPLOYEE' ? 'Approved By' : 'Manager Action'}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(activeRole === 'EMPLOYEE'
                      ? leaves.filter((l) => l.employeeId === (user?.id || 1) || l.employeeName.includes(user?.firstName || 'Alex'))
                      : leaves
                    ).map((l) => (
                      <TableRow key={l.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{l.appliedDate}</TableCell>
                        {activeRole !== 'EMPLOYEE' && <TableCell sx={{ fontWeight: 600 }}>{l.employeeName}</TableCell>}
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {l.leaveType.replace('_', ' ')}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{l.startDate} to {l.endDate}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{l.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={l.status}
                            size="small"
                            color={l.status === 'APPROVED' ? 'success' : l.status === 'PENDING' ? 'warning' : 'error'}
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {activeRole === 'EMPLOYEE' ? (
                            <Typography variant="body2" color="text.secondary">
                              {l.approvedBy || '—'}
                            </Typography>
                          ) : l.status === 'PENDING' && (activeRole === 'ADMIN' || activeRole === 'ROLE_ADMIN' || activeRole === 'ROLE_MANAGER') ? (
                            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<ApproveIcon />}
                                onClick={() => approveLeaveRequest(l.id, user ? user.firstName : 'Admin')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<RejectIcon />}
                                onClick={() => rejectLeaveRequest(l.id)}
                              >
                                Reject
                              </Button>
                            </Stack>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              {l.approvedBy ? `By ${l.approvedBy}` : 'Processed'}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 2: PAYROLL & PAYSLIP */}
          {activeTab === 2 && (
            <Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      {activeRole !== 'EMPLOYEE' && <TableCell>Employee</TableCell>}
                      <TableCell>Basic Salary</TableCell>
                      <TableCell>Bonuses</TableCell>
                      <TableCell>Deductions</TableCell>
                      <TableCell>Net Pay</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Payslip Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(activeRole === 'EMPLOYEE'
                      ? payrolls.filter((p) => p.employeeId === (user?.id || 1) || p.employeeName.includes(user?.firstName || 'Alex'))
                      : payrolls
                    ).map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{p.month}</TableCell>
                        {activeRole !== 'EMPLOYEE' && <TableCell sx={{ fontWeight: 600 }}>{p.employeeName}</TableCell>}
                        <TableCell>₹{p.basicSalary.toLocaleString('en-IN')}</TableCell>
                        <TableCell sx={{ color: 'success.main', fontWeight: 600 }}>+₹{p.allowances.toLocaleString('en-IN')}</TableCell>
                        <TableCell sx={{ color: 'error.main', fontWeight: 600 }}>-₹{p.deductions.toLocaleString('en-IN')}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>
                          ₹{p.netSalary.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.status}
                            size="small"
                            color={p.status === 'PAID' ? 'success' : p.status === 'PROCESSED' ? 'info' : 'warning'}
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" startIcon={<PrintIcon />} onClick={() => handleOpenPayslip(p)}>
                            View Slip
                          </Button>
                          {activeRole !== 'EMPLOYEE' && p.status === 'PROCESSED' && (activeRole === 'ADMIN' || activeRole === 'ROLE_ADMIN' || activeRole === 'ROLE_MANAGER') && (
                            <Button size="small" variant="contained" color="success" sx={{ ml: 1 }} onClick={() => markPayrollPaid(p.id)}>
                              Mark Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 3: PROJECT & TASK REPORTS */}
          {activeTab === 3 && activeRole !== 'EMPLOYEE' && (
            <Box>

              {/* Report Sub-Tabs Navigation */}
              <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Button
                  variant={subReportTab === 'project' ? 'contained' : 'outlined'}
                  onClick={() => setSubReportTab('project')}
                  size="small"
                  sx={{ fontWeight: 700 }}
                >
                  Project Progress Report
                </Button>
                <Button
                  variant={subReportTab === 'employee' ? 'contained' : 'outlined'}
                  onClick={() => setSubReportTab('employee')}
                  size="small"
                  sx={{ fontWeight: 700 }}
                >
                  Employee-wise Task Report
                </Button>
                <Button
                  variant={subReportTab === 'pending' ? 'contained' : 'outlined'}
                  onClick={() => setSubReportTab('pending')}
                  size="small"
                  sx={{ fontWeight: 700 }}
                >
                  Pending Tasks Report
                </Button>
              </Stack>

              {/* Sub-Report: Project Progress */}
              {subReportTab === 'project' && (
                <Box>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Project Implementation & Progress Matrix
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          const headers = ['Project Code', 'Project Name', 'Client Name', 'Status', 'Progress %', 'Budget (₹)'];
                          const rows = projects.map((p) => [p.projectCode, p.name, p.clientName, p.status, p.progressPercentage, p.budget]);
                          exportToCSV('Project_Progress_Report', headers, rows);
                        }}
                      >
                        Export CSV
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          const headers = ['Project Code', 'Project Name', 'Client Name', 'Status', 'Progress %', 'Budget (₹)'];
                          const rows = projects.map((p) => [p.projectCode, p.name, p.clientName, p.status, `${p.progressPercentage}%`, `₹${p.budget.toLocaleString('en-IN')}`]);
                          exportToPDF('Project Progress Report', 'Active client projects implementation progress and financial budget matrix.', headers, rows, 'Project_Progress_Report');
                        }}
                      >
                        Export PDF
                      </Button>
                    </Stack>
                  </Box>

                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Project Name</TableCell>
                          <TableCell>Client Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Progress %</TableCell>
                          <TableCell align="right">Budget (₹)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projects.map((p) => (
                          <TableRow key={p.id} hover>
                            <TableCell sx={{ fontWeight: 700 }}><code>{p.projectCode}</code></TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                            <TableCell>{p.clientName}</TableCell>
                            <TableCell>
                              <Chip
                                label={p.status}
                                size="small"
                                color={p.status === 'COMPLETED' ? 'success' : p.status === 'PLANNING' ? 'default' : 'primary'}
                                variant="outlined"
                                sx={{ fontWeight: 700, fontSize: '0.62rem', height: 18 }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {p.progressPercentage}%
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                              ₹{p.budget.toLocaleString('en-IN')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Sub-Report: Employee-wise Tasks */}
              {subReportTab === 'employee' && (
                <Box>
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2.5 }}>
                    <FormControl size="small" sx={{ width: 220 }}>
                      <InputLabel id="report-emp-select">Select Employee</InputLabel>
                      <Select
                        labelId="report-emp-select"
                        value={selectedReportEmpId}
                        onChange={(e) => setSelectedReportEmpId(Number(e.target.value))}
                        label="Select Employee"
                      >
                        {employees.map((emp) => (
                          <MenuItem key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName} ({emp.designation})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          const emp = employees.find((e) => e.id === selectedReportEmpId);
                          if (!emp) return;
                          const empTasks = tasks.filter((t) => t.assigneeId === emp.id || t.assigneeName.includes(emp.firstName));
                          const headers = ['Task Code', 'Title', 'Project Name', 'Priority', 'Progress %', 'Status', 'Due Date', 'Remarks'];
                          const rows = empTasks.map((t) => [t.taskCode, t.title, t.projectName, t.priority, t.progress || 0, t.status, t.dueDate, t.remarks || '']);
                          exportToCSV(`Tasks_Report_${emp.firstName}_${emp.lastName}`, headers, rows);
                        }}
                      >
                        Export CSV
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          const emp = employees.find((e) => e.id === selectedReportEmpId);
                          if (!emp) return;
                          const empTasks = tasks.filter((t) => t.assigneeId === emp.id || t.assigneeName.includes(emp.firstName));
                          const headers = ['Task Code', 'Title', 'Project Name', 'Priority', 'Progress %', 'Status', 'Due Date', 'Remarks'];
                          const rows = empTasks.map((t) => [t.taskCode, t.title, t.projectName, t.priority, `${t.progress || 0}%`, t.status, t.dueDate, t.remarks || 'N/A']);
                          exportToPDF(
                            `Tasks Report: ${emp.firstName} ${emp.lastName}`,
                            `Professional task allocation, execution statuses, and progress logs for employee.`,
                            headers,
                            rows,
                            `Tasks_Report_${emp.firstName}_${emp.lastName}`
                          );
                        }}
                      >
                        Export PDF
                      </Button>
                    </Stack>
                  </Box>

                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Task Title</TableCell>
                          <TableCell>Project</TableCell>
                          <TableCell>Priority</TableCell>
                          <TableCell>Progress %</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Remarks</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(() => {
                          const emp = employees.find((e) => e.id === selectedReportEmpId);
                          if (!emp) return <TableRow><TableCell colSpan={8} align="center">Select an employee</TableCell></TableRow>;
                          const empTasks = tasks.filter((t) => t.assigneeId === emp.id || t.assigneeName.includes(emp.firstName));
                          if (empTasks.length === 0) return <TableRow><TableCell colSpan={8} align="center" sx={{ py: 3 }}>No tasks assigned to this employee</TableCell></TableRow>;
                          return empTasks.map((t) => (
                            <TableRow key={t.id} hover>
                              <TableCell sx={{ fontWeight: 700 }}><code>{t.taskCode}</code></TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{t.projectName}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t.priority}
                                  size="small"
                                  color={t.priority === 'CRITICAL' ? 'error' : t.priority === 'HIGH' ? 'warning' : 'default'}
                                  variant="outlined"
                                  sx={{ fontWeight: 700, fontSize: '0.6rem', height: 18 }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {t.progress || 0}%
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={t.status}
                                  size="small"
                                  color={t.status === 'COMPLETED' ? 'success' : 'info'}
                                  sx={{ fontWeight: 700, fontSize: '0.62rem', height: 18 }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{t.dueDate}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary', fontStyle: 'italic' }}>
                                {t.remarks || '—'}
                              </TableCell>
                            </TableRow>
                          ));
                        })()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Sub-Report: Pending Tasks */}
              {subReportTab === 'pending' && (
                <Box>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Pending Enterprise Tasks (Action Required)
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          const pendingTasks = tasks.filter((t) => t.status !== 'COMPLETED');
                          const headers = ['Task Code', 'Task Title', 'Project Name', 'Assignee', 'Priority', 'Progress %', 'Status', 'Due Date'];
                          const rows = pendingTasks.map((t) => [t.taskCode, t.title, t.projectName, t.assigneeName, t.priority, t.progress || 0, t.status, t.dueDate]);
                          exportToCSV('Pending_Tasks_Report', headers, rows);
                        }}
                      >
                        Export CSV
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          const pendingTasks = tasks.filter((t) => t.status !== 'COMPLETED');
                          const headers = ['Task Code', 'Task Title', 'Project Name', 'Assignee', 'Priority', 'Progress %', 'Status', 'Due Date'];
                          const rows = pendingTasks.map((t) => [t.taskCode, t.title, t.projectName, t.assigneeName, t.priority, `${t.progress || 0}%`, t.status, t.dueDate]);
                          exportToPDF(
                            'Pending Enterprise Tasks',
                            'Comprehensive list of uncompleted tasks, assignees, priorities, and implementation deadlines.',
                            headers,
                            rows,
                            'Pending_Tasks_Report'
                          );
                        }}
                      >
                        Export PDF
                      </Button>
                    </Stack>
                  </Box>

                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Task Title</TableCell>
                          <TableCell>Project Name</TableCell>
                          <TableCell>Assignee</TableCell>
                          <TableCell>Priority</TableCell>
                          <TableCell>Progress %</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Due Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(() => {
                          const pendingTasks = tasks.filter((t) => t.status !== 'COMPLETED');
                          if (pendingTasks.length === 0) return <TableRow><TableCell colSpan={8} align="center" sx={{ py: 3 }}>No pending tasks found</TableCell></TableRow>;
                          return pendingTasks.map((t) => (
                            <TableRow key={t.id} hover>
                              <TableCell sx={{ fontWeight: 700 }}><code>{t.taskCode}</code></TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{t.projectName}</TableCell>
                              <TableCell sx={{ fontWeight: 500 }}>{t.assigneeName}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t.priority}
                                  size="small"
                                  color={t.priority === 'CRITICAL' ? 'error' : t.priority === 'HIGH' ? 'warning' : 'default'}
                                  variant="outlined"
                                  sx={{ fontWeight: 700, fontSize: '0.6rem', height: 18 }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {t.progress || 0}%
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={t.status}
                                  size="small"
                                  color="info"
                                  sx={{ fontWeight: 700, fontSize: '0.62rem', height: 18 }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{t.dueDate}</TableCell>
                            </TableRow>
                          ));
                        })()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Card>

      {/* Dialog: Leave Request */}
      <Dialog open={openLeaveModal} onClose={() => setOpenLeaveModal(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleCreateLeaveRequest}>
          <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
            Submit Leave Request
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 3 }}>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <FormControl size="small" fullWidth required>
                <InputLabel>Leave Category</InputLabel>
                <Select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                  label="Leave Category"
                >
                  <MenuItem value="CASUAL_LEAVE">Casual Leave</MenuItem>
                  <MenuItem value="SICK_LEAVE">Sick Leave</MenuItem>
                  <MenuItem value="PAID_LEAVE">Paid Vacation</MenuItem>
                  <MenuItem value="MATERNITY_LEAVE">Maternity / Paternity Leave</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="date"
                size="small"
                label="Start Date"
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                type="date"
                size="small"
                label="End Date"
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                multiline
                rows={3}
                size="small"
                label="Reason / Notes"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setOpenLeaveModal(false)} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained">Submit Request</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Payslip Modal */}
      <Dialog open={openPayslipModal} onClose={() => setOpenPayslipModal(false)} maxWidth="sm" fullWidth>
        {selectedPayroll && (
          <Box>
            <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2, textAlign: 'center' }}>
              Salary Payslip Statement
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ border: '1px solid', borderColor: 'divider', p: 3, borderRadius: 1.5, bgcolor: 'background.default', mt: 1 }}>
                <Typography variant="subtitle1" align="center" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                  SMART ENTERPRISE SYSTEMS INC.
                </Typography>
                <Typography variant="caption" align="center" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
                  Pay Statement for Month: <strong>{selectedPayroll.month}</strong>
                </Typography>

                <Divider sx={{ mb: 2, borderColor: 'divider' }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
                  <Typography variant="body2" color="text.primary"><strong>Employee:</strong> {selectedPayroll.employeeName}</Typography>
                  <Typography variant="body2" color="text.primary"><strong>Payment Date:</strong> {selectedPayroll.paymentDate}</Typography>
                  <Typography variant="body2" color="text.primary"><strong>Status:</strong> {selectedPayroll.status}</Typography>
                </Box>

                <Divider sx={{ mb: 2, borderColor: 'divider' }} />

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Earning Breakdown</TableCell>
                      <TableCell align="right">Amount (₹)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Basic Base Salary</TableCell>
                      <TableCell align="right">₹{selectedPayroll.basicSalary.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Performance Allowances & Bonuses</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main' }}>+₹{selectedPayroll.allowances.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tax & Healthcare Deductions</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main' }}>-₹{selectedPayroll.deductions.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: 'action.selected' }}>
                      <TableCell sx={{ fontWeight: 800 }}>NET PAYABLE SALARY</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.05rem' }}>
                        ₹{selectedPayroll.netSalary.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() =>
                  generatePayslipPDF(
                    selectedPayroll.employeeName,
                    selectedPayroll.month,
                    selectedPayroll.basicSalary,
                    selectedPayroll.allowances,
                    selectedPayroll.deductions,
                    selectedPayroll.netSalary
                  )
                }
              >
                Download PDF Payslip
              </Button>
              <Button onClick={() => setOpenPayslipModal(false)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};
