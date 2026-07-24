import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Divider,
  Box,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as AdminDashboardIcon,
  Badge as EmployeeDashboardIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Assignment as ProjectIcon,
  ReceiptLong as ReportsIcon,
  Person as ProfileIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Lock as LockIcon,
  CheckCircle as CompleteIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '../../types';

export interface ModuleMenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  moduleNumber?: number;
  allowedRoles: RoleType[];
}

interface SidebarProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export const MODULE_ITEMS: ModuleMenuItem[] = [
  // Admin Modules
  {
    id: 'admin_dashboard',
    title: 'Dashboard',
    subtitle: 'System Metrics & Analytics',
    icon: <AdminDashboardIcon fontSize="small" />,
    badge: 'ADMIN',
    badgeColor: 'primary',
    allowedRoles: ['ADMIN'],
  },
  {
    id: 'module2_employees',
    title: 'Employees',
    subtitle: 'Employee Directory & CRUD',
    icon: <PeopleIcon fontSize="small" />,
    badge: 'CRUD',
    badgeColor: 'success',
    allowedRoles: ['ADMIN'],
  },
  {
    id: 'module3_projects',
    title: 'Projects',
    subtitle: 'Manage Enterprise Projects',
    icon: <ProjectIcon fontSize="small" />,
    badge: 'PROJECTS',
    badgeColor: 'warning',
    allowedRoles: ['ADMIN'],
  },
  {
    id: 'module3_tasks',
    title: 'Tasks',
    subtitle: 'Task Boards & Kanban',
    icon: <ProjectIcon fontSize="small" />,
    badge: 'KANBAN',
    badgeColor: 'info',
    allowedRoles: ['ADMIN'],
  },
  {
    id: 'module4_reports',
    title: 'Reports',
    subtitle: 'Attendance, Payroll & Auditing',
    icon: <ReportsIcon fontSize="small" />,
    badge: 'REPORTS',
    badgeColor: 'secondary',
    allowedRoles: ['ADMIN'],
  },
  {
    id: 'module5_profile',
    title: 'Profile',
    subtitle: 'My Personal Profile',
    icon: <ProfileIcon fontSize="small" />,
    allowedRoles: ['ADMIN', 'EMPLOYEE'],
  },
  {
    id: 'module5_settings',
    title: 'Settings',
    subtitle: 'System Configuration & Health',
    icon: <ProfileIcon fontSize="small" />,
    allowedRoles: ['ADMIN'],
  },

  // Employee Modules
  {
    id: 'employee_dashboard',
    title: 'Dashboard',
    subtitle: 'Self Service Portal Home',
    icon: <EmployeeDashboardIcon fontSize="small" />,
    badge: 'PORTAL',
    badgeColor: 'info',
    allowedRoles: ['EMPLOYEE'],
  },
  {
    id: 'employee_tasks',
    title: 'My Assigned Tasks',
    subtitle: 'Tasks assigned to me',
    icon: <ProjectIcon fontSize="small" />,
    badge: 'TASKS',
    badgeColor: 'success',
    allowedRoles: ['EMPLOYEE'],
  },
  {
    id: 'employee_completed',
    title: 'Completed Tasks',
    subtitle: 'Tasks I have marked done',
    icon: <CompleteIcon fontSize="small" />,
    badge: 'DONE',
    badgeColor: 'success',
    allowedRoles: ['EMPLOYEE'],
  },
  {
    id: 'employee_deadlines',
    title: 'Upcoming Deadlines',
    subtitle: 'Schedules & Milestones',
    icon: <ScheduleIcon fontSize="small" />,
    badge: 'DEADLINES',
    badgeColor: 'warning',
    allowedRoles: ['EMPLOYEE'],
  },

  // Common Action
  {
    id: 'logout',
    title: 'Logout',
    subtitle: 'End secure session',
    icon: <LockIcon fontSize="small" />,
    allowedRoles: ['ADMIN', 'EMPLOYEE'],
  },
];

const DRAWER_WIDTH = 270;

export const Sidebar: React.FC<SidebarProps> = ({
  activeModuleId,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const { activeRole } = useAuth();

  // Sidebar colors for light mode (white) and dark mode (dark slate)
  const getSidebarBg = (mode: string) => (mode === 'light' ? '#FFFFFF' : '#111827');
  const getSidebarBorder = (mode: string) => (mode === 'light' ? '#E2E8F0' : '#1F2937');

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 64 : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 64 : DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: 48,
          height: 'calc(100% - 48px)',
          borderRight: '1px solid',
          borderColor: (theme) => getSidebarBorder(theme.palette.mode),
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          bgcolor: (theme) => getSidebarBg(theme.palette.mode),
          color: 'text.primary',
          overflowX: 'hidden',
          // Customize scrollbar inside sidebar
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: (theme) => theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: (theme) => theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)',
          },
        },
      }}
    >
      <Box sx={{ p: collapsed ? 1 : 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
        {!collapsed && (
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 0.8 }}>
              NAVIGATION MENU
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Enterprise Operations
            </Typography>
          </Box>
        )}
        <Tooltip title={collapsed ? 'Expand Menu' : 'Collapse Menu'}>
          <ListItemButton
            onClick={onToggleCollapse}
            sx={{
              borderRadius: 1,
              minWidth: 36,
              height: 36,
              justifyContent: 'center',
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </ListItemButton>
        </Tooltip>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      <List sx={{ px: 1, py: 1.5 }}>
        {MODULE_ITEMS.filter((item) => item.allowedRoles.includes(activeRole)).map((item) => {
          const isSelected = activeModuleId === item.id;

          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip
                title={collapsed ? item.title : ''}
                placement="right"
              >
                <ListItemButton
                  selected={isSelected}
                  onClick={() => {
                    if (item.id === 'logout') {
                      onLogout();
                    } else {
                      onSelectModule(item.id);
                    }
                  }}
                  sx={{
                    borderRadius: 1.5,
                    minHeight: 40,
                    px: collapsed ? 1.5 : 2,
                    mx: 0.5,
                    borderLeft: isSelected ? '3px solid' : '3px solid transparent',
                    borderLeftColor: 'primary.main',
                    bgcolor: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: isSelected ? 'primary.main' : 'text.secondary',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: isSelected ? 'primary.main' : 'text.primary',
                      '& .MuiListItemIcon-root': {
                        color: isSelected ? 'primary.main' : 'text.primary',
                      },
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(59, 130, 246, 0.15)',
                      color: 'primary.main',
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: 'rgba(59, 130, 246, 0.2)',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 32,
                      color: isSelected ? 'primary.main' : 'text.secondary',
                      transition: 'color 0.15s ease-in-out',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isSelected ? 700 : 500,
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            color: isSelected ? 'primary.main' : 'inherit',
                          }}
                        >
                          {item.title}
                        </Typography>
                        {item.badge ? (
                          <Chip
                            label={item.badge}
                            size="small"
                            color={item.badgeColor || 'default'}
                            sx={{
                              fontWeight: 800,
                              ml: 1,
                              bgcolor: isSelected ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                              color: isSelected ? '#FFFFFF' : 'text.secondary',
                              border: 'none',
                            }}
                          />
                        ) : null}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          color: 'text.secondary',
                        }}
                      >
                        {item.subtitle}
                      </Typography>
                    </Box>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

    </Drawer>
  );
};
