import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Divider,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Assignment as TaskIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  AssignmentTurnedIn as CompleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface EmployeeDashboardProps {
  filter?: 'assigned' | 'completed' | 'deadlines';
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ filter }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { tasks, attendance, checkIn, checkOut, leaves, payrolls, updateTaskStatus } = useData();

  let myTasks = tasks.filter((t) => t.assigneeId === (user?.id || 1) || t.assigneeName.includes(user?.firstName || 'Alex'));
  
  if (filter === 'assigned') {
    myTasks = myTasks.filter((t) => t.status !== 'COMPLETED');
  } else if (filter === 'completed') {
    myTasks = myTasks.filter((t) => t.status === 'COMPLETED');
  } else if (filter === 'deadlines') {
    myTasks = myTasks.filter((t) => t.status !== 'COMPLETED').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  const myLeaves = leaves.filter((l) => l.employeeId === (user?.id || 1) || l.employeeName.includes(user?.firstName || 'Alex'));
  const myPayrolls = payrolls.filter((p) => p.employeeId === (user?.id || 1) || p.employeeName.includes(user?.firstName || 'Alex'));

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find((a) => a.date === today);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Greeting */}
      <Card
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(59, 130, 246, 0.15)',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, rgba(37, 99, 235, 0.01) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              src={user?.profilePictureUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394A3B8'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>"}
              sx={{
                width: 52,
                height: 52,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                Welcome back, {user?.firstName} {user?.lastName}!
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.designation} • {user?.department} • ID: <code>{user?.employeeCode || 'EMP-1001'}</code>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {!todayAttendance ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayIcon />}
                onClick={() => checkIn(user?.id || 1, `${user?.firstName} ${user?.lastName}`)}
                sx={{ fontWeight: 700 }}
              >
                Clock In Today
              </Button>
            ) : todayAttendance.checkOutTime === '-' ? (
              <Button
                variant="contained"
                color="warning"
                onClick={() => checkOut(user?.id || 1)}
                sx={{ fontWeight: 700 }}
              >
                Clock Out ({todayAttendance.checkInTime})
              </Button>
            ) : (
              <Chip
                label={`Shift Complete (${todayAttendance.totalHours} hrs)`}
                color="success"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>
        </Box>
      </Card>

      {/* Grid Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          {/* My Tasks */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <TaskIcon sx={{ color: 'primary.main', fontSize: 20 }} /> {filter === 'assigned' ? 'My Assigned Active Tasks' : filter === 'completed' ? 'Completed Tasks' : filter === 'deadlines' ? 'Upcoming Deadlines' : 'My Assigned Active Tasks'} ({myTasks.length})
              </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code & Title</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <CompleteIcon sx={{ color: 'text.secondary', fontSize: 32, mb: 1, opacity: 0.5 }} />
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          All caught up!
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          No active tasks assigned to you right now.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    myTasks.map((t) => (
                      <TableRow key={t.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
                            <code>{t.taskCode}</code>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{t.projectName}</TableCell>
                        <TableCell>
                          <Chip
                            label={t.priority}
                            size="small"
                            color={t.priority === 'CRITICAL' ? 'error' : t.priority === 'HIGH' ? 'warning' : 'default'}
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{t.dueDate}</TableCell>
                        <TableCell>
                          <Chip
                            label={t.status}
                            size="small"
                            color={t.status === 'COMPLETED' ? 'success' : 'info'}
                            sx={{ height: 20, fontWeight: 700, fontSize: '0.65rem' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {t.status !== 'COMPLETED' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => updateTaskStatus(t.id, 'COMPLETED')}
                              sx={{ py: 0.5, px: 1, fontSize: '0.75rem' }}
                            >
                              Mark Done
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {/* Quick Stats */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon sx={{ color: 'text.secondary', fontSize: 18 }} /> My Portal Summary
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Attendance Status</Typography>
                <Chip
                  label={todayAttendance ? 'Checked In' : 'Not Clocked In'}
                  color={todayAttendance ? 'success' : 'default'}
                  variant={todayAttendance ? 'filled' : 'outlined'}
                  size="small"
                  sx={{ fontWeight: 700, height: 22 }}
                />
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Pending Leaves</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {myLeaves.filter((l) => l.status === 'PENDING').length}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Latest Net Salary</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.main' }}>
                  ₹{(myPayrolls[0]?.netSalary || 138000).toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
