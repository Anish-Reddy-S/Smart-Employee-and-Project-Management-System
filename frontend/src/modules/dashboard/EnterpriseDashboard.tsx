import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  Security as SecurityIcon,
  Assignment as ProjectIcon,
  Speed as SpeedIcon,
  Check as CheckIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface EnterpriseDashboardProps {
  onNavigateModule: (moduleId: string) => void;
}

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ onNavigateModule }) => {
  const { user, activeRole } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Azure Banner */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          background: 'linear-gradient(90deg, #0078D4 0%, #005A9E 100%)',
          color: '#ffffff',
          borderRadius: 1.5,
          boxShadow: '0 4px 12px rgba(0, 120, 212, 0.25)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Smart Employee & Project Management Architecture
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Enterprise System Instance initialized for <strong>{user?.firstName} {user?.lastName}</strong> ({activeRole})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                <Chip label="Module 1: Auth & Security [ACTIVE]" size="small" sx={{ bgcolor: '#FFF', color: '#0078D4', fontWeight: 700 }} />
                <Chip label="Java 17 LTS Backend" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FFF' }} />
                <Chip label="Spring Security JWT" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FFF' }} />
                <Chip label="MySQL 8.0 JPA" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FFF' }} />
              </Box>
            </Box>

            <Button
              variant="contained"
              sx={{ bgcolor: '#ffffff', color: '#0078D4', fontWeight: 700, '&:hover': { bgcolor: '#F3F2F1' } }}
              onClick={() => onNavigateModule('module1_auth')}
              endIcon={<ArrowIcon />}
            >
              Manage Auth & Security
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* KPI Stats Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3 }}>
        <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Active Employees
              </Typography>
              <Avatar sx={{ bgcolor: 'rgba(0, 120, 212, 0.1)', color: '#0078D4', width: 36, height: 36 }}>
                <PeopleIcon fontSize="small" />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              148
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Across 6 Engineering Departments
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Active Projects
              </Typography>
              <Avatar sx={{ bgcolor: 'rgba(0, 130, 114, 0.1)', color: '#008272', width: 36, height: 36 }}>
                <ProjectIcon fontSize="small" />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              24
            </Typography>
            <Typography variant="caption" color="text.secondary">
              12 In Sprint • 8 Delivered • 4 On Hold
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                JWT Security Health
              </Typography>
              <Avatar sx={{ bgcolor: 'rgba(16, 124, 65, 0.1)', color: '#107C41', width: 36, height: 36 }}>
                <SecurityIcon fontSize="small" />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#107C41' }}>
              100%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Stateless SecurityFilterChain Active
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                MySQL Latency
              </Typography>
              <Avatar sx={{ bgcolor: 'rgba(217, 119, 6, 0.1)', color: '#D97706', width: 36, height: 36 }}>
                <SpeedIcon fontSize="small" />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              1.8 ms
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Connection Pool: HikariCP 20 Connections
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Main Body Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 3 }}>
        {/* Module Progression Map */}
        <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
          <Box sx={{ p: 2, bgcolor: '#F3F2F1', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Enterprise System Architecture Roadmap
            </Typography>
            <Chip label="INCREMENTAL BUILD" size="small" color="primary" sx={{ fontWeight: 700 }} />
          </Box>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Module</TableCell>
                    <TableCell>Target Capabilities</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover selected>
                    <TableCell sx={{ fontWeight: 700, color: '#0078D4' }}>
                      1. Auth, Security & RBAC
                    </TableCell>
                    <TableCell>JWT, Spring Security 6, Roles, BCrypt, MySQL Users DDL</TableCell>
                    <TableCell>
                      <Chip label="COMPLETED & LIVE" color="success" size="small" sx={{ fontWeight: 700, height: 20 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="contained" onClick={() => onNavigateModule('module1_auth')}>
                        Launch
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 600 }}>2. Employee Directory</TableCell>
                    <TableCell>Full Employee CRUD, Photo Uploads, Skills & Search</TableCell>
                    <TableCell>
                      <Chip label="READY FOR MODULE 2" color="info" size="small" sx={{ fontWeight: 700, height: 20 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => onNavigateModule('module2_employees')}>
                        Preview
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 600 }}>3. Departments & Hierarchy</TableCell>
                    <TableCell>Department Master, One-to-Many Mappings, Managers</TableCell>
                    <TableCell>
                      <Chip label="STAGE 3" size="small" sx={{ height: 20 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => onNavigateModule('module3_departments')}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 600 }}>4. Projects & Tasks (Jira)</TableCell>
                    <TableCell>Kanban Board, Sprint Allocation, Many-to-Many Relationships</TableCell>
                    <TableCell>
                      <Chip label="STAGE 4" size="small" sx={{ height: 20 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => onNavigateModule('module4_projects')}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 600 }}>5. Attendance & Payroll</TableCell>
                    <TableCell>Attendance Logging, Deductions, Pay Slip Engine</TableCell>
                    <TableCell>
                      <Chip label="STAGE 5" size="small" sx={{ height: 20 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => onNavigateModule('module5_payroll')}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Spring Boot Infrastructure Panel */}
        <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
          <Box sx={{ p: 2, bgcolor: '#106EBE', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Spring Boot Actuator & Stack Status
            </Typography>
            <Chip label="JAVA 17 LTS" size="small" sx={{ bgcolor: '#FFF', color: '#106EBE', fontWeight: 800 }} />
          </Box>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  JVM Memory Utilization (420 MB / 1024 MB)
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  41%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={41} sx={{ height: 6, borderRadius: 1 }} />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  HikariCP Connection Pool (8 / 20 Active)
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  40%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={40} color="success" sx={{ height: 6, borderRadius: 1 }} />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Layered Architecture Compliance Checklist:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckIcon sx={{ color: '#107C41', fontSize: 16 }} /> DTO Pattern for Request & Response decoupling
              </Typography>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckIcon sx={{ color: '#107C41', fontSize: 16 }} /> Spring Data JPA Repositories with custom queries
              </Typography>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckIcon sx={{ color: '#107C41', fontSize: 16 }} /> Global Exception Handling (@RestControllerAdvice)
              </Typography>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckIcon sx={{ color: '#107C41', fontSize: 16 }} /> OpenAPI / Swagger 3.0 Documentation
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
