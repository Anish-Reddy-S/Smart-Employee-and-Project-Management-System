import React, { useState } from 'react';
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
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Assignment as TaskIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  AssignmentTurnedIn as CompleteIcon,
  ArrowForward as ArrowForwardIcon,
  EventNote as EventNoteIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  AccountCircle as ProfileIcon,
  ReceiptLong as ReportsIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Task } from '../../types';

interface EmployeeDashboardProps {
  filter?: 'assigned' | 'completed' | 'deadlines';
  onNavigateModule?: (id: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ filter, onNavigateModule }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { tasks, attendance, checkIn, checkOut, leaves, payrolls, updateTaskStatus } = useData();

  // Search and Filter States for Task View
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Task['status']>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | Task['priority']>('ALL');

  // Filter tasks assigned to current employee
  const myAllTasks = tasks.filter(
    (t) => t.assigneeId === (user?.id || 1) || t.assigneeName.includes(user?.firstName || 'Alex')
  );

  const myLeaves = leaves.filter(
    (l) => l.employeeId === (user?.id || 1) || l.employeeName.includes(user?.firstName || 'Alex')
  );
  const myPayrolls = payrolls.filter(
    (p) => p.employeeId === (user?.id || 1) || p.employeeName.includes(user?.firstName || 'Alex')
  );

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find((a) => a.date === today);

  // Statistics for KPI Cards
  const activeCount = myAllTasks.filter((t) => t.status !== 'COMPLETED').length;
  const completedCount = myAllTasks.filter((t) => t.status === 'COMPLETED').length;

  const upcomingDeadlinesCount = myAllTasks.filter((t) => {
    if (t.status === 'COMPLETED') return false;
    const due = new Date(t.dueDate).getTime();
    const now = new Date().getTime();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  // ----------------------------------------------------
  // RENDER DEDICATED TASKS PAGE (FILTER MODE)
  // ----------------------------------------------------
  if (filter) {
    let title = 'My Taskboard';
    let subtitle = 'Manage and track your active tasks. Update task stages as you work.';

    if (filter === 'completed') {
      title = 'Completed Tasks Archive';
      subtitle = 'Review tasks you have successfully finished and submitted.';
    } else if (filter === 'deadlines') {
      title = 'Schedules & Milestones';
      subtitle = 'Upcoming active deadlines sorted by priority and urgency.';
    }

    // Apply filters based on page mode
    let filteredTasks = [...myAllTasks];

    if (filter === 'assigned') {
      // Show active (non-completed) by default, but allow status filtering
      if (statusFilter === 'ALL') {
        filteredTasks = filteredTasks.filter((t) => t.status !== 'COMPLETED');
      } else {
        filteredTasks = filteredTasks.filter((t) => t.status === statusFilter);
      }
    } else if (filter === 'completed') {
      filteredTasks = filteredTasks.filter((t) => t.status === 'COMPLETED');
    } else if (filter === 'deadlines') {
      filteredTasks = filteredTasks
        .filter((t) => t.status !== 'COMPLETED')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }

    // Apply priority filter
    if (priorityFilter !== 'ALL') {
      filteredTasks = filteredTasks.filter((t) => t.priority === priorityFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.taskCode.toLowerCase().includes(q) ||
          t.projectName.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    const getPriorityColor = (p: Task['priority']) => {
      switch (p) {
        case 'CRITICAL':
          return 'error';
        case 'HIGH':
          return 'warning';
        case 'MEDIUM':
          return 'primary';
        case 'LOW':
        default:
          return 'default';
      }
    };

    const getStatusColor = (s: Task['status']) => {
      switch (s) {
        case 'COMPLETED':
          return 'success';
        case 'IN_REVIEW':
          return 'warning';
        case 'IN_PROGRESS':
          return 'info';
        case 'TO_DO':
        default:
          return 'default';
      }
    };

    return (
      <Box sx={{ p: 3 }}>
        {/* Back navigation */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => onNavigateModule?.('employee_dashboard')}
          sx={{ mb: 2, fontWeight: 700 }}
          size="small"
        >
          Back to Dashboard
        </Button>

        {/* Page Title & Subtitle */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: -0.5, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Box>

        {/* Filters Toolbar */}
        <Card variant="outlined" sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search Input */}
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by code, title, project or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Status Filter (Only shown on Assigned Tasks tab) */}
            {filter === 'assigned' && (
              <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="status-filter-select-label">Status Filter</InputLabel>
                  <Select
                    labelId="status-filter-select-label"
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                  >
                    <MenuItem value="ALL">All Active (Excludes Completed)</MenuItem>
                    <MenuItem value="TO_DO">To Do</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="IN_REVIEW">In Review</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Priority Filter */}
            <Grid size={{ xs: 12, sm: 6, md: filter === 'assigned' ? 3.5 : 7 }}>
              <FormControl size="small" fullWidth sx={{ maxWidth: filter === 'assigned' ? 'none' : 240 }}>
                <InputLabel id="priority-filter-select-label">Priority Filter</InputLabel>
                <Select
                  labelId="priority-filter-select-label"
                  value={priorityFilter}
                  label="Priority Filter"
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                >
                  <MenuItem value="ALL">All Priorities</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Task Cards Grid */}
        <Grid container spacing={3}>
          {filteredTasks.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Paper
                variant="outlined"
                sx={{
                  py: 8,
                  px: 4,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  borderColor: 'divider',
                }}
              >
                <CompleteIcon sx={{ color: 'text.secondary', fontSize: 44, mb: 1.5, opacity: 0.4 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                  No Matching Tasks Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search terms or filters to find what you are looking for.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            filteredTasks.map((t) => {
              const borderStyles = {
                CRITICAL: '4px solid ' + theme.palette.error.main,
                HIGH: '4px solid ' + theme.palette.warning.main,
                MEDIUM: '4px solid ' + theme.palette.primary.main,
                LOW: '4px solid ' + theme.palette.text.disabled,
              };

              return (
                <Grid key={t.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderLeft: borderStyles[t.priority] || '1px solid',
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  >
                    <Box sx={{ p: 2.5, flexGrow: 1 }}>
                      {/* Project Name and Priority */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            bgcolor: 'rgba(59, 130, 246, 0.08)',
                            px: 1,
                            py: 0.3,
                            borderRadius: 1,
                          }}
                        >
                          {t.projectName}
                        </Typography>
                        <Chip
                          label={t.priority}
                          size="small"
                          color={getPriorityColor(t.priority)}
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800 }}
                        />
                      </Box>

                      {/* Code and Title */}
                      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>
                        {t.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'monospace', color: 'text.secondary', display: 'block', mb: 1.5 }}
                      >
                        Code: {t.taskCode}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: 60,
                          fontSize: '0.825rem',
                        }}
                      >
                        {t.description || 'No description provided.'}
                      </Typography>

                      {/* Progress Bar */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Task Progress
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {t.progress || 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={t.progress || 0}
                          sx={{ height: 5, borderRadius: 1 }}
                        />
                      </Box>
                    </Box>

                    <Divider />

                    <Box sx={{ p: 2, bgcolor: 'action.hover', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {/* Due Date Info */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <EventNoteIcon fontSize="inherit" />
                          <Typography variant="caption">Due Date:</Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color:
                              t.status !== 'COMPLETED' && new Date(t.dueDate) < new Date()
                                ? 'error.main'
                                : 'text.primary',
                          }}
                        >
                          {t.dueDate}
                        </Typography>
                      </Box>

                      {/* Status and Action dropdown */}
                      {t.status !== 'COMPLETED' ? (
                        <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
                          <InputLabel id={`status-select-label-${t.id}`} sx={{ fontSize: '0.8rem' }}>
                            Update Stage
                          </InputLabel>
                          <Select
                            labelId={`status-select-label-${t.id}`}
                            value={t.status}
                            label="Update Stage"
                            size="small"
                            onChange={(e) => updateTaskStatus(t.id, e.target.value as Task['status'])}
                            sx={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              bgcolor: 'background.paper',
                            }}
                          >
                            <MenuItem value="TO_DO" sx={{ fontSize: '0.8rem' }}>
                              To Do
                            </MenuItem>
                            <MenuItem value="IN_PROGRESS" sx={{ fontSize: '0.8rem' }}>
                              In Progress
                            </MenuItem>
                            <MenuItem value="IN_REVIEW" sx={{ fontSize: '0.8rem' }}>
                              In Review
                            </MenuItem>
                            <MenuItem value="COMPLETED" sx={{ fontSize: '0.8rem' }}>
                              Completed
                            </MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            py: 0.5,
                            bgcolor: 'rgba(16, 185, 129, 0.08)',
                            borderRadius: 1,
                            color: 'success.main',
                          }}
                        >
                          <CheckCircleIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption" sx={{ fontWeight: 800 }}>
                            COMPLETED (100%)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
    );
  }

  // ----------------------------------------------------
  // RENDER MAIN EMPLOYEE PORTAL DASHBOARD (DEFAULT VIEW)
  // ----------------------------------------------------
  // Calculate top 3 active urgent tasks for Dashboard checklist
  const urgentTasks = [...myAllTasks]
    .filter((t) => t.status !== 'COMPLETED')
    .sort((a, b) => {
      // Sort critical -> high -> medium -> low
      const prioWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const aWeight = prioWeight[a.priority] || 0;
      const bWeight = prioWeight[b.priority] || 0;
      if (aWeight !== bWeight) return bWeight - aWeight;
      // Secondary sort: nearest due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 3);

  return (
    <Box sx={{ p: 3 }}>
      {/* 1. Header Greeting Card */}
      <Card
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(59, 130, 246, 0.15)',
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, rgba(37, 99, 235, 0.01) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              src={user?.profilePictureUrl || undefined}
              sx={{
                width: 54,
                height: 54,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 700,
                fontSize: '1.25rem',
              }}
            >
              {user?.firstName ? user.firstName[0].toUpperCase() : 'E'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, letterSpacing: -0.5 }}>
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

      {/* 2. KPI Metrics Grid Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* KPI 1: Active Workspace */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(37, 99, 235, 0.08)', color: 'primary.main', display: 'flex' }}>
                <TaskIcon fontSize="small" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {activeCount}
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Active Workspace
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Tasks currently assigned to you
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                variant="text"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={() => onNavigateModule?.('employee_tasks')}
                sx={{ fontWeight: 700, p: 0, minWidth: 0 }}
              >
                Open Taskboard
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* KPI 2: Completed Tasks */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(16, 185, 129, 0.08)', color: 'success.main', display: 'flex' }}>
                <CheckCircleIcon fontSize="small" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                {completedCount}
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Completed Tasks
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              History of finished tasks
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                variant="text"
                color="success"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={() => onNavigateModule?.('employee_completed')}
                sx={{ fontWeight: 700, p: 0, minWidth: 0 }}
              >
                View Archive
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* KPI 3: Upcoming Deadlines */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(245, 158, 11, 0.08)', color: 'warning.main', display: 'flex' }}>
                <ScheduleIcon fontSize="small" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
                {upcomingDeadlinesCount}
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Upcoming Deadlines
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Tasks due within 7 days
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                variant="text"
                color="warning"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={() => onNavigateModule?.('employee_deadlines')}
                sx={{ fontWeight: 700, p: 0, minWidth: 0 }}
              >
                Track Schedules
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* KPI 4: Pending Leaves */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(139, 92, 246, 0.08)', color: 'secondary.main', display: 'flex' }}>
                <EventNoteIcon fontSize="small" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                {myLeaves.filter((l) => l.status === 'PENDING').length}
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Pending Approvals
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Time-off requests pending review
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                variant="text"
                color="secondary"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={() => onNavigateModule?.('employee_reports')}
                sx={{ fontWeight: 700, p: 0, minWidth: 0 }}
              >
                Leaves & Reports
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 3. Detailed Grid (Left 8/12, Right 4/12) */}
      <Grid container spacing={3}>
        {/* Left Column: Recent Tasks & Quick Actions */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Card: Urgent Task List */}
          <Card variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TaskIcon sx={{ color: 'primary.main', fontSize: 20 }} /> Urgent Task Checklist
              </Typography>
              <Button
                size="small"
                variant="text"
                onClick={() => onNavigateModule?.('employee_tasks')}
                sx={{ fontWeight: 700 }}
              >
                Go to Workspace
              </Button>
            </Box>

            {urgentTasks.length === 0 ? (
              <Box sx={{ py: 4, px: 2, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 32, mb: 1, opacity: 0.7 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  You're all caught up!
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  No active urgent tasks are on your plate right now.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider', mb: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Task Info</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {urgentTasks.map((t) => (
                      <TableRow key={t.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            {t.title}
                          </Typography>
                          <Typography variant="caption" color="primary.main" sx={{ fontFamily: 'monospace' }}>
                            {t.taskCode}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{t.projectName}</TableCell>
                        <TableCell>
                          <Chip
                            label={t.priority}
                            size="small"
                            color={t.priority === 'CRITICAL' || t.priority === 'HIGH' ? 'error' : 'default'}
                            variant="outlined"
                            sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 100 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={t.progress || 0}
                                sx={{ height: 4, borderRadius: 1 }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 24 }}>
                              {t.progress || 0}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="text"
                            color="success"
                            onClick={() => updateTaskStatus(t.id, 'COMPLETED')}
                            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                          >
                            Mark Done
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>

          {/* Card: Self Service Actions */}
          <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: 'secondary.main', fontSize: 18 }} /> Self-Service Portal Services
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ReportsIcon />}
                  onClick={() => onNavigateModule?.('employee_reports')}
                  sx={{ justifyContent: 'flex-start', py: 1.5, px: 2, borderRadius: 1.5, fontWeight: 700 }}
                >
                  Submit Leave Request
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ReportsIcon />}
                  onClick={() => onNavigateModule?.('employee_reports')}
                  sx={{ justifyContent: 'flex-start', py: 1.5, px: 2, borderRadius: 1.5, fontWeight: 700 }}
                >
                  Download Payslips
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ProfileIcon />}
                  onClick={() => onNavigateModule?.('module5_profile')}
                  sx={{ justifyContent: 'flex-start', py: 1.5, px: 2, borderRadius: 1.5, fontWeight: 700 }}
                >
                  Update Personal Profile
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EventNoteIcon />}
                  onClick={() => onNavigateModule?.('employee_reports')}
                  sx={{ justifyContent: 'flex-start', py: 1.5, px: 2, borderRadius: 1.5, fontWeight: 700 }}
                >
                  View My Attendance Records
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Right Column: Portal Info & Announcements */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Card: Summary Info */}
          <Card variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ color: 'text.secondary', fontSize: 18 }} /> Portal Quick Stats
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Attendance Status
                </Typography>
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
                <Typography variant="body2" color="text.secondary">
                  Clock-In Time
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {todayAttendance ? todayAttendance.checkInTime : '--:--'}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Leaves Pending Approval
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {myLeaves.filter((l) => l.status === 'PENDING').length}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Latest Net Pay
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.main' }}>
                  ₹{(myPayrolls[0]?.netSalary || 138000).toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Card: Announcements */}
          <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon sx={{ color: 'primary.main', fontSize: 18 }} /> System announcements
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                  June Payroll Released
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Yesterday
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>
                  Your monthly payslip for June is available for download in the Reports module.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                  SOC 2 Compliance Audit
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  3 days ago
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>
                  We are carrying out access reviews. Please make sure your contact details are updated.
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
