import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableRow,
  TableHead,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Assignment as ProjectIcon,
  ViewWeek as KanbanIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowRightIcon,
  ArrowBack as ArrowLeftIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { Project, Task } from '../../types';
import { apiEvents } from '../../services/api';

interface ProjectTaskModuleViewProps {
  defaultTab?: number;
}

export const ProjectTaskModuleView: React.FC<ProjectTaskModuleViewProps> = ({ defaultTab = 0 }) => {
  const theme = useTheme();
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    employees,
  } = useData();

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Search & Filter State
  const [projectSearch, setProjectSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals State
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Project Form
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    projectCode: `PRJ-2026-${Math.floor(10 + Math.random() * 90)}`,
    name: '',
    clientName: '',
    description: '',
    department: 'Software Engineering',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    budget: 150000,
    status: 'IN_PROGRESS',
    teamLead: 'Michael Chen',
    memberCount: 5,
    progressPercentage: 25,
  });

  // Task Form
  const [taskForm, setTaskForm] = useState<Omit<Task, 'id'>>({
    taskCode: `TSK-${Math.floor(200 + Math.random() * 800)}`,
    title: '',
    description: '',
    projectId: 1,
    projectName: 'Smart Employee Portal Modernization',
    assigneeId: 3,
    assigneeName: 'Sarah Sharma',
    priority: 'HIGH',
    status: 'TO_DO',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedHours: 16,
    actualHours: 0,
    progress: 0,
    remarks: '',
  });

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.clientName.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.projectCode.toLowerCase().includes(projectSearch.toLowerCase())
    );
  }, [projects, projectSearch]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
        t.taskCode.toLowerCase().includes(taskSearch.toLowerCase()) ||
        t.assigneeName.toLowerCase().includes(taskSearch.toLowerCase());
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, taskSearch, priorityFilter]);

  // Project Modal Actions
  const handleOpenAddProject = () => {
    setSelectedProject(null);
    setProjectForm({
      projectCode: `PRJ-2026-${Math.floor(10 + Math.random() * 90)}`,
      name: '',
      clientName: '',
      description: '',
      department: 'Software Engineering',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      budget: 150000,
      status: 'IN_PROGRESS',
      teamLead: 'Michael Chen',
      memberCount: 5,
      progressPercentage: 25,
    });
    setOpenProjectModal(true);
  };

  const handleOpenEditProject = (prj: Project) => {
    setSelectedProject(prj);
    setProjectForm({
      projectCode: prj.projectCode,
      name: prj.name,
      clientName: prj.clientName,
      description: prj.description,
      department: prj.department,
      startDate: prj.startDate,
      endDate: prj.endDate,
      budget: prj.budget,
      status: prj.status,
      teamLead: prj.teamLead,
      memberCount: prj.memberCount,
      progressPercentage: prj.progressPercentage,
    });
    setOpenProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject) {
      updateProject(selectedProject.id, projectForm);
    } else {
      addProject(projectForm);
    }
    setOpenProjectModal(false);
  };

  // Task Modal Actions
  const handleOpenAddTask = () => {
    setSelectedTask(null);
    const defaultPrj = projects[0] || { id: 1, name: 'General Project' };
    const defaultEmp = employees[0] || { id: 1, firstName: 'Alex', lastName: 'Vance' };

    setTaskForm({
      taskCode: `TSK-${Math.floor(200 + Math.random() * 800)}`,
      title: '',
      description: '',
      projectId: defaultPrj.id,
      projectName: defaultPrj.name,
      assigneeId: defaultEmp.id,
      assigneeName: `${defaultEmp.firstName} ${defaultEmp.lastName}`,
      priority: 'HIGH',
      status: 'TO_DO',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedHours: 16,
      actualHours: 0,
      progress: 0,
      remarks: '',
    });
    setOpenTaskModal(true);
  };

  const handleOpenEditTask = (tsk: Task) => {
    setSelectedTask(tsk);
    setTaskForm({
      taskCode: tsk.taskCode,
      title: tsk.title,
      description: tsk.description,
      projectId: tsk.projectId,
      projectName: tsk.projectName,
      assigneeId: tsk.assigneeId,
      assigneeName: tsk.assigneeName,
      priority: tsk.priority,
      status: tsk.status,
      dueDate: tsk.dueDate,
      estimatedHours: tsk.estimatedHours,
      actualHours: tsk.actualHours,
      progress: tsk.progress || 0,
      remarks: tsk.remarks || '',
    });
    setOpenTaskModal(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask) {
      updateTask(selectedTask.id, taskForm);
    } else {
      addTask(taskForm);
    }
    setOpenTaskModal(false);
  };

  // Task Status Advancement
  const advanceTaskStatus = (tsk: Task, direction: 'next' | 'prev') => {
    const statuses: Task['status'][] = ['TO_DO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'];
    const idx = statuses.indexOf(tsk.status);
    if (direction === 'next' && idx < statuses.length - 1) {
      updateTaskStatus(tsk.id, statuses[idx + 1]);
    } else if (direction === 'prev' && idx > 0) {
      updateTaskStatus(tsk.id, statuses[idx - 1]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title Banner */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <ProjectIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Projects & Tasks Workspace
            </Typography>
            <Chip
              label="KANBAN"
              color="warning"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.62rem', height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage client project allocations, budgets, progress metrics, and interactive task Kanban workflow.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {activeTab === 0 ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddProject}>
              Create Project
            </Button>
          ) : (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddTask}>
              Create Task
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
          <Tab icon={<ProjectIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Projects Directory" />
          <Tab icon={<KanbanIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Task Kanban Board" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* TAB 0: PROJECTS DIRECTORY */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ mb: 2.5, display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search project name, code, or client..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  sx={{ width: 320 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Code & Name</TableCell>
                      <TableCell>Client / Dept</TableCell>
                      <TableCell>Team Lead</TableCell>
                      <TableCell>Budget</TableCell>
                      <TableCell>Completion Progress</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProjects.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {p.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
                            <code>{p.projectCode}</code>
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.clientName}</Typography>
                          <Typography variant="caption" color="text.secondary">{p.department}</Typography>
                        </TableCell>

                        <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{p.teamLead}</TableCell>

                        <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>
                          ₹{p.budget.toLocaleString('en-IN')}
                        </TableCell>

                        <TableCell sx={{ minWidth: 160 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={p.progressPercentage}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: 'action.focus',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: p.progressPercentage === 100 ? 'success.main' : 'primary.main',
                                  },
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 32 }}>
                              {p.progressPercentage}%
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={p.status}
                            size="small"
                            color={
                              p.status === 'COMPLETED'
                                ? 'success'
                                : p.status === 'IN_PROGRESS'
                                ? 'info'
                                : p.status === 'PLANNING'
                                ? 'warning'
                                : 'default'
                            }
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                            <IconButton size="small" onClick={() => handleOpenEditProject(p)} color="secondary" sx={{ p: 0.5 }}>
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => deleteProject(p.id)} color="error" sx={{ p: 0.5 }}>
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 1: TASK KANBAN BOARD */}
          {activeTab === 1 && (
            <Box>
              {/* Task Controls */}
              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search tasks by title or assignee..."
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  sx={{ width: 280 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <FormControl size="small" sx={{ width: 180 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} label="Priority">
                    <MenuItem value="ALL">All Priorities</MenuItem>
                    <MenuItem value="CRITICAL">CRITICAL</MenuItem>
                    <MenuItem value="HIGH">HIGH</MenuItem>
                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                    <MenuItem value="LOW">LOW</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Kanban Grid Columns */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
                {[
                  { status: 'TO_DO', label: 'TO DO', color: theme.palette.text.secondary },
                  { status: 'IN_PROGRESS', label: 'IN PROGRESS', color: theme.palette.primary.main },
                  { status: 'IN_REVIEW', label: 'IN REVIEW', color: theme.palette.warning.main },
                  { status: 'COMPLETED', label: 'COMPLETED', color: theme.palette.success.main },
                ].map((col) => {
                  const colTasks = filteredTasks.filter((t) => t.status === col.status);
                  return (
                    <Paper
                      key={col.status}
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        minHeight: 450,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '2px solid', borderColor: col.color }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: col.color }}>
                          {col.label}
                        </Typography>
                        <Chip
                          label={colTasks.length}
                          size="small"
                          sx={{
                            height: 18,
                            fontWeight: 700,
                            fontSize: '0.62rem',
                            bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
                            color: 'text.primary',
                          }}
                        />
                      </Box>

                      <Stack spacing={2}>
                        {colTasks.map((t) => (
                          <Card
                            key={t.id}
                            variant="outlined"
                            sx={{
                              p: 2,
                              borderRadius: 1.5,
                              borderColor: 'divider',
                              transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                                borderColor: 'primary.main',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>
                                  <code>{t.taskCode}</code>
                                </Typography>
                                <IconButton size="small" onClick={() => handleOpenEditTask(t)} sx={{ p: 0.2 }}>
                                  <EditIcon sx={{ fontSize: 13 }} />
                                </IconButton>
                              </Box>
                              <Chip
                                label={t.priority}
                                size="small"
                                color={t.priority === 'CRITICAL' ? 'error' : t.priority === 'HIGH' ? 'warning' : 'default'}
                                variant="outlined"
                                sx={{ height: 16, fontSize: '0.58rem', fontWeight: 700 }}
                              />
                            </Box>

                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>
                              {t.title}
                            </Typography>

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                              {t.projectName}
                            </Typography>

                            {/* Progress bar */}
                            {t.progress !== undefined && (
                              <Box sx={{ mb: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Progress</Typography>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>{t.progress}%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={t.progress} sx={{ height: 4, borderRadius: 2 }} />
                              </Box>
                            )}

                            {/* Remarks */}
                            {t.remarks && (
                              <Box sx={{ mb: 1.5, p: 1, bgcolor: 'background.default', borderRadius: 1, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, fontSize: '0.62rem' }}>Remarks:</Typography>
                                <Typography variant="caption" color="text.primary" sx={{ display: 'block', fontStyle: 'italic', wordBreak: 'break-word' }}>
                                  "{t.remarks}"
                                </Typography>
                              </Box>
                            )}

                            <Divider sx={{ my: 1.5, borderColor: 'divider' }} />

                             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.8,
                                  cursor: 'pointer',
                                  '&:hover': { '& .assignee-text': { color: 'primary.main', textDecoration: 'underline' } }
                                }}
                                onClick={() => apiEvents.emitViewProfile({ name: t.assigneeName })}
                              >
                                <Avatar sx={{ width: 22, height: 22, fontSize: '0.65rem', bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 }}>
                                  {t.assigneeName.charAt(0)}
                                </Avatar>
                                <Typography className="assignee-text" variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                  {t.assigneeName.split(' ')[0]}
                                </Typography>
                              </Box>

                              <Stack direction="row" spacing={0.2}>
                                {col.status !== 'TO_DO' && (
                                  <IconButton size="small" onClick={() => advanceTaskStatus(t, 'prev')} sx={{ p: 0.2 }}>
                                    <ArrowLeftIcon fontSize="small" />
                                  </IconButton>
                                )}
                                {col.status !== 'COMPLETED' && (
                                  <IconButton size="small" onClick={() => advanceTaskStatus(t, 'next')} color="primary" sx={{ p: 0.2 }}>
                                    <ArrowRightIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Stack>
                            </Box>
                          </Card>
                        ))}
                      </Stack>
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </Card>

      {/* Project Modal */}
      <Dialog open={openProjectModal} onClose={() => setOpenProjectModal(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSaveProject}>
          <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
            {selectedProject ? 'Edit Project Details' : 'Create New Client Project'}
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mt: 1 }}>
              <TextField
                required
                size="small"
                label="Project Code"
                value={projectForm.projectCode}
                onChange={(e) => setProjectForm({ ...projectForm, projectCode: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="Project Name"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="Client Name"
                value={projectForm.clientName}
                onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
              />
              <TextField
                type="number"
                size="small"
                label="Budget (₹)"
                value={projectForm.budget}
                onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
              />
              <TextField
                type="number"
                size="small"
                label="Progress %"
                value={projectForm.progressPercentage}
                onChange={(e) => setProjectForm({ ...projectForm, progressPercentage: Number(e.target.value) })}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                  label="Status"
                >
                  <MenuItem value="PLANNING">PLANNING</MenuItem>
                  <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                  <MenuItem value="ON_HOLD">ON_HOLD</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setOpenProjectModal(false)} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained">Save Project</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Task Modal */}
      <Dialog open={openTaskModal} onClose={() => setOpenTaskModal(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSaveTask}>
          <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
            {selectedTask ? 'Edit Task Details' : 'Create Task'}
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mt: 1 }}>
              <TextField
                required
                size="small"
                label="Task Code"
                value={taskForm.taskCode}
                onChange={(e) => setTaskForm({ ...taskForm, taskCode: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="Task Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Assigned Project</InputLabel>
                <Select
                  value={taskForm.projectId}
                  onChange={(e) => {
                    const prjId = Number(e.target.value);
                    const prj = projects.find((p) => p.id === prjId);
                    setTaskForm({ ...taskForm, projectId: prjId, projectName: prj?.name || '' });
                  }}
                  label="Assigned Project"
                >
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={taskForm.assigneeId}
                  onChange={(e) => {
                    const empId = Number(e.target.value);
                    const emp = employees.find((e) => e.id === empId);
                    setTaskForm({ ...taskForm, assigneeId: empId, assigneeName: `${emp?.firstName} ${emp?.lastName}` });
                  }}
                  label="Assignee"
                >
                  {employees.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.designation})</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                  label="Priority"
                >
                  <MenuItem value="LOW">LOW</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HIGH">HIGH</MenuItem>
                  <MenuItem value="CRITICAL">CRITICAL</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as any })}
                  label="Status"
                >
                  <MenuItem value="TO_DO">TO DO</MenuItem>
                  <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                  <MenuItem value="IN_REVIEW">IN REVIEW</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="number"
                size="small"
                label="Progress %"
                slotProps={{ htmlInput: { min: 0, max: 100 } }}
                value={taskForm.progress || 0}
                onChange={(e) => setTaskForm({ ...taskForm, progress: Number(e.target.value) })}
              />

              <TextField
                size="small"
                label="Remarks"
                multiline
                rows={2}
                value={taskForm.remarks || ''}
                onChange={(e) => setTaskForm({ ...taskForm, remarks: e.target.value })}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setOpenTaskModal(false)} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained">Save Task</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
