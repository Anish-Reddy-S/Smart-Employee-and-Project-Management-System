import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  People as PeopleIcon,
  Assignment as ProjectIcon,
  CheckCircle as TasksIcon,
  Payments as PayrollIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useData } from '../../context/DataContext';

interface AdminDashboardProps {
  onNavigateModule: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateModule }) => {
  const theme = useTheme();
  const { employees, projects, tasks, auditLogs, payrolls } = useData();

  const totalEmployees = employees.length;
  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'COMPLETED').length;
  const totalPayrollBudget = payrolls.reduce((acc, p) => acc + p.netSalary, 0);

  // Department distribution data for Pie Chart
  const deptCounts: Record<string, number> = {};
  employees.forEach((e) => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });
  const pieData = Object.keys(deptCounts).map((dept) => ({
    name: dept,
    value: deptCounts[dept],
  }));

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
  ];

  // Project Progress data for Bar Chart
  const projectChartData = projects.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    Progress: p.progressPercentage,
    Budget: p.budget / 1000,
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Banner */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            Control Center & Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time telemetry, Spring Security audit trails, database statistics & department KPI performance metrics.
          </Typography>
        </Box>
        <Chip
          label="HYBRID CLOUD HOSTED"
          variant="outlined"
          color="primary"
          sx={{
            fontWeight: 800,
            fontSize: '0.65rem',
            borderWidth: 1.5,
            bgcolor: theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(59, 130, 246, 0.1)',
          }}
        />
      </Box>

      {/* KPI Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                bgcolor: 'primary.main',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>TOTAL EMPLOYEES</Typography>
              <PeopleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{totalEmployees}</Typography>
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>+12% from last month</Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                bgcolor: 'success.main',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>ACTIVE PROJECTS</Typography>
              <ProjectIcon sx={{ color: 'success.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{activeProjects}</Typography>
            <Typography variant="caption" color="text.secondary">{projects.length} Total Registered</Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                bgcolor: 'warning.main',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>OPEN TASKS</Typography>
              <TasksIcon sx={{ color: 'warning.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{pendingTasks}</Typography>
            <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700 }}>Action Needed</Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                bgcolor: 'error.main',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>MONTHLY PAYROLL</Typography>
              <PayrollIcon sx={{ color: 'error.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>₹{totalPayrollBudget.toLocaleString('en-IN')}</Typography>
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>Budget Approved</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
              Project Completion Progress (%)
            </Typography>
            <Box sx={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" fontSize={11} stroke={theme.palette.text.secondary} />
                  <YAxis domain={[0, 100]} stroke={theme.palette.text.secondary} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                      borderRadius: 6,
                      color: theme.palette.text.primary,
                    }}
                  />
                  <Bar dataKey="Progress" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Employee Department Allocation
            </Typography>
            <Box sx={{ height: 240, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} labelLine={false}>
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                      borderRadius: 6,
                      color: theme.palette.text.primary,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Audit Logs Table */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SecurityIcon sx={{ color: 'primary.main', fontSize: 22 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Live Security & Mutation Audit Trail
            </Typography>
          </Box>
          <Button
            size="small"
            variant="text"
            endIcon={<ArrowForwardIcon />}
            onClick={() => onNavigateModule('module1_auth')}
            sx={{ fontWeight: 600 }}
          >
            View Full Security Logs
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Target Entity</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.slice(0, 5).map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>{log.timestamp}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    <code>{log.username}</code>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{log.entityName} #{log.entityId}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{log.details}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
                    <code>{log.ipAddress}</code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
