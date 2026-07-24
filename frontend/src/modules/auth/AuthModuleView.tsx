import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Security as SecurityIcon,
  VpnKey as JwtIcon,
  People as PeopleIcon,
  Code as CodeIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon,
  SwapHoriz as SwapIcon,
  Terminal as TerminalIcon,
  AssignmentTurnedIn as ShieldIcon,
  Schema as SchemaIcon,
  BugReport as BugIcon,
  WifiOff as NetworkErrorIcon,
  ErrorOutlined as ErrorIcon,
  Autorenew as AutoRefreshIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authService, testErrorService } from '../../services/api';
import { User, Role } from '../../types';
import { CodeViewer } from '../../components/common/CodeViewer';
import { AUTH_MODULE_JAVA_FILES, DATABASE_AND_DOCS_FILES } from '../../data/springBootCodeData';

interface AuthModuleViewProps {
  onOpenSwagger: () => void;
}

export const AuthModuleView: React.FC<AuthModuleViewProps> = ({ onOpenSwagger }) => {
  const theme = useTheme();
  const { user: currentUser, activeRole, switchRole, logout, refreshToken } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Users & Roles state
  const [usersList, setUsersList] = useState<User[]>([]);
  const [rolesList, setRolesList] = useState<Role[]>([]);

  // Register Modal State
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [regData, setRegData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'ROLE_EMPLOYEE',
  });
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Fetch users
  const loadUserData = async () => {
    try {
      const uRes = await authService.getUsers();
      if (uRes.data) setUsersList(uRes.data);

      const rRes = await authService.getRoles();
      if (rRes.data) setRolesList(rRes.data);
    } catch (err) {
      console.error('Error loading users', err);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);
    try {
      const res = await authService.register(regData);
      if (res.status === 201) {
        setRegSuccess(`User '${regData.username}' successfully registered into MySQL DB!`);
        loadUserData();
        setTimeout(() => {
          setOpenRegisterDialog(false);
          setRegSuccess(null);
          setRegData({
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            role: 'ROLE_EMPLOYEE',
          });
        }, 1500);
      }
    } catch (err: any) {
      setRegError(err.response?.data?.message || 'Failed to register user');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Module Title Banner */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <SecurityIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Authentication & Security Logs
            </Typography>
            <Chip
              label="SPRING SECURITY 6"
              color="success"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.62rem', height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Enterprise JWT Token Authentication, Axios Interceptors, Automatic Logout, Refresh Tokens & HTTP Error Handling (401, 403, 404, 500, Network Errors).
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" startIcon={<TerminalIcon />} onClick={onOpenSwagger}>
            Swagger OpenAPI Studio
          </Button>
        </Box>
      </Box>

      {/* Main Tabs */}
      <Card variant="outlined" sx={{ borderRadius: 1.5, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            px: 2,
            pt: 1,
          }}
        >
          <Tab icon={<PeopleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Live Users & Auth Portal" />
          <Tab icon={<BugIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Axios Interceptors & Error Test Suite" />
          <Tab icon={<ShieldIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="RBAC Privilege Matrix" />
          <Tab icon={<CodeIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Spring Boot Java Source Code" />
          <Tab icon={<SchemaIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Filter Chain Architecture" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* TAB 0: Live User Accounts */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Registered System Accounts (Spring Data JPA Users)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Real-time accounts stored in MySQL database table <code>users</code> with role mapping.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={loadUserData}>
                    Refresh Table
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenRegisterDialog(true)}
                  >
                    Add Employee User
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Department & Title</TableCell>
                      <TableCell>Assigned Roles</TableCell>
                      <TableCell>Account Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usersList.map((u) => (
                      <TableRow key={u.id} hover selected={currentUser?.username === u.username}>
                        <TableCell sx={{ fontWeight: 700 }}>#{u.id}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                          <code>{u.username}</code>
                        </TableCell>
                        <TableCell>{u.firstName} {u.lastName}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                            {u.department || 'Software Engineering'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {u.designation || 'Staff Associate'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {u.roles?.map((r) => (
                            <Chip
                              key={r}
                              label={r.replace('ROLE_', '')}
                              size="small"
                              color={r === 'ROLE_ADMIN' ? 'error' : r === 'ROLE_MANAGER' ? 'warning' : 'success'}
                              variant="outlined"
                              sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20, mr: 0.5 }}
                            />
                          ))}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.enabled ? 'ENABLED' : 'DISABLED'}
                            color={u.enabled ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 700, height: 18, fontSize: '0.6rem' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Switch to test this role">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => u.roles && switchRole(u.roles[0])}
                            >
                              <SwapIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 1: Axios Interceptors & Error Test Suite */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Axios Global Interceptors & HTTP Error Handling Suite
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                Test frontend REST response handlers for 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error, Validation Errors, and Network drops.
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Card 1: 401 & Automatic Logout / Refresh Tokens */}
                <Card variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <AutoRefreshIcon fontSize="small" /> 401 Unauthorized & auto refresh
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    Trigger 401 response from Spring Boot. The Axios interceptor checks for refresh token to renew session or executes automatic logout with Snackbar notice.
                  </Typography>

                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<ErrorIcon />}
                      onClick={() => testErrorService.trigger401().catch(() => {})}
                    >
                      Trigger 401 Error
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<AutoRefreshIcon />}
                      onClick={() =>
                        authService
                          .refreshToken(refreshToken || 'refresh_sample_123')
                          .catch(() => {})
                      }
                    >
                      Test Refresh Token
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      startIcon={<LogoutIcon />}
                      onClick={logout}
                    >
                      Force Logout
                    </Button>
                  </Stack>
                </Card>

                {/* Card 2: 403 Forbidden & RBAC */}
                <Card variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'warning.main', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <LockIcon fontSize="small" /> 403 Forbidden Access Violation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    Trigger 403 Forbidden response. Axios interceptor catches 403 and displays a warning Snackbar notification.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    startIcon={<LockIcon />}
                    onClick={() => testErrorService.trigger403().catch(() => {})}
                  >
                    Trigger 403 Forbidden
                  </Button>
                </Card>

                {/* Card 3: 404 Not Found & 500 Server Error */}
                <Card variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <BugIcon fontSize="small" /> 404 Not Found & 500 Server Error
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    Trigger 404 resource missing or 500 server exception. Interceptor catches and presents clear user feedback.
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => testErrorService.trigger404().catch(() => {})}
                    >
                      Trigger 404
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => testErrorService.trigger500().catch(() => {})}
                    >
                      Trigger 500 Exception
                    </Button>
                  </Stack>
                </Card>

                {/* Card 4: Validation Errors & Network Errors */}
                <Card variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <NetworkErrorIcon fontSize="small" /> Constraint Validation & Network Drops
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    Simulate JSR-380 @Valid constraint violation messages or network interface disconnections.
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => testErrorService.triggerValidation().catch(() => {})}
                    >
                      Trigger Validation Errors
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      startIcon={<NetworkErrorIcon />}
                      onClick={() => testErrorService.triggerNetworkError().catch(() => {})}
                    >
                      Simulate Offline
                    </Button>
                  </Stack>
                </Card>
              </Box>
            </Box>
          )}

          {/* TAB 2: RBAC Privilege Matrix */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Role-Based Access Control (RBAC) Matrix
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Fine-grained method security configured with <code>@PreAuthorize("hasRole('ADMIN')")</code> and <code>hasRole('MANAGER')</code>.
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Privilege / Action</TableCell>
                      <TableCell>Spring Security Annotation</TableCell>
                      <TableCell align="center">ROLE_ADMIN</TableCell>
                      <TableCell align="center">ROLE_MANAGER</TableCell>
                      <TableCell align="center">ROLE_EMPLOYEE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { action: 'Create / Register Users', security: "@PreAuthorize(\"hasRole('ADMIN')\")", admin: true, manager: false, employee: false },
                      { action: 'Manage Roles & Security Config', security: "@PreAuthorize(\"hasRole('ADMIN')\")", admin: true, manager: false, employee: false },
                      { action: 'View All System Employees', security: "@PreAuthorize(\"hasAnyRole('ADMIN', 'MANAGER')\")", admin: true, manager: true, employee: false },
                      { action: 'Update Department Employee Info', security: "@PreAuthorize(\"hasAnyRole('ADMIN', 'MANAGER')\")", admin: true, manager: true, employee: false },
                      { action: 'Create / Assign Projects & Tasks', security: "@PreAuthorize(\"hasAnyRole('ADMIN', 'MANAGER')\")", admin: true, manager: true, employee: false },
                      { action: 'Approve Attendance & Leaves', security: "@PreAuthorize(\"hasAnyRole('ADMIN', 'MANAGER')\")", admin: true, manager: true, employee: false },
                      { action: 'Update Own Task Status & Log Attendance', security: '@PreAuthorize("isAuthenticated()")', admin: true, manager: true, employee: true },
                      { action: 'View Own Payslip & Profile', security: '@PreAuthorize("isAuthenticated()")', admin: true, manager: true, employee: true },
                    ].map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{row.action}</TableCell>
                        <TableCell>
                          <code>{row.security}</code>
                        </TableCell>
                        <TableCell align="center">
                          {row.admin ? <CheckIcon sx={{ color: 'success.main' }} /> : <LockIcon sx={{ color: 'error.main', fontSize: 18 }} />}
                        </TableCell>
                        <TableCell align="center">
                          {row.manager ? <CheckIcon sx={{ color: 'success.main' }} /> : <LockIcon sx={{ color: 'error.main', fontSize: 18 }} />}
                        </TableCell>
                        <TableCell align="center">
                          {row.employee ? <CheckIcon sx={{ color: 'success.main' }} /> : <LockIcon sx={{ color: 'error.main', fontSize: 18 }} />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 3: Spring Boot Java Source Code */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>
                Backend Java 17 + Spring Security 6.x Source Code Blueprint
              </Typography>
              <CodeViewer files={[...AUTH_MODULE_JAVA_FILES, ...DATABASE_AND_DOCS_FILES]} title="MODULE 1: JAVA 17 SPRING BOOT SECURITY & DATABASE CODE" subtitle="PRODUCTION READY BLUEPRINT" />
            </Box>
          )}

          {/* TAB 4: Filter Chain Architecture */}
          {activeTab === 4 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Spring Security Filter Chain & JWT Lifecycle
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Card variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    1. Client Request & JWT Filtering
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Every incoming REST request passes through <code>AuthTokenFilter</code> before reaching the Spring <code>@RestController</code>. If a valid <code>Bearer &lt;token&gt;</code> is present, claims are extracted and authenticated.
                  </Typography>
                </Card>

                <Card variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    2. Database User Authentication
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    During login, <code>DaoAuthenticationProvider</code> delegates credentials to <code>UserDetailsServiceImpl</code>, which queries MySQL database via <code>UserRepository.findByUsername()</code> and verifies password with BCrypt.
                  </Typography>
                </Card>
              </Box>
            </Box>
          )}
        </Box>
      </Card>

      {/* Add Employee User Dialog */}
      <Dialog open={openRegisterDialog} onClose={() => setOpenRegisterDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleRegisterSubmit}>
          <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
            Register New Enterprise User Account
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 3 }}>
            {regError && <Alert severity="error" sx={{ mb: 2 }}>{regError}</Alert>}
            {regSuccess && <Alert severity="success" sx={{ mb: 2 }}>{regSuccess}</Alert>}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mt: 1 }}>
              <TextField
                fullWidth
                required
                label="Username"
                size="small"
                value={regData.username}
                onChange={(e) => setRegData({ ...regData, username: e.target.value })}
              />
              <TextField
                fullWidth
                required
                type="email"
                label="Email Address"
                size="small"
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
              />
              <TextField
                fullWidth
                required
                label="First Name"
                size="small"
                value={regData.firstName}
                onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
              />
              <TextField
                fullWidth
                required
                label="Last Name"
                size="small"
                value={regData.lastName}
                onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
              />
              <TextField
                fullWidth
                required
                type="password"
                label="Password"
                size="small"
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Security Role</InputLabel>
                <Select
                  value={regData.role}
                  onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                  label="Security Role"
                >
                  <MenuItem value="ROLE_EMPLOYEE">ROLE_EMPLOYEE (Standard Staff)</MenuItem>
                  <MenuItem value="ROLE_MANAGER">ROLE_MANAGER (Engineering Lead)</MenuItem>
                  <MenuItem value="ROLE_ADMIN">ROLE_ADMIN (Administrator)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setOpenRegisterDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create Account
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
