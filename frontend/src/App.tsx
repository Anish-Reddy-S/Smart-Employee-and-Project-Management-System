import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { getAzureTheme } from './theme/azureTheme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { LoginView } from './modules/auth/LoginView';
import { AzureHeader } from './components/layout/AzureHeader';
import { Sidebar, MODULE_ITEMS } from './components/layout/Sidebar';
import { SwaggerInspector } from './components/common/SwaggerInspector';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { UserProfileDialog } from './components/common/UserProfileDialog';
import { apiEvents } from './services/api';
// Module Views
import { AdminDashboard } from './modules/dashboard/AdminDashboard';
import { EmployeeDashboard } from './modules/dashboard/EmployeeDashboard';
import { EmployeeModuleView } from './modules/employees/EmployeeModuleView';
import { ProjectTaskModuleView } from './modules/projects/ProjectTaskModuleView';
import { ReportsModuleView } from './modules/reports/ReportsModuleView';
import { ProfileSettingsView } from './modules/profile/ProfileSettingsView';
import { SettingsView } from './modules/profile/SettingsView';

function AppContent() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [activeModuleId, setActiveModuleId] = useState<string>('admin_dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [openSwaggerModal, setOpenSwaggerModal] = useState<boolean>(false);
  const [profileTarget, setProfileTarget] = useState<any | null>(null);
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState<boolean>(false);

  const { isAuthenticated, activeRole, logout } = useAuth();
  const { snackbar, hideSnackbar, isApiLoading, employees } = useData();

  useEffect(() => {
    const unsubscribe = apiEvents.subscribeViewProfile((identifier) => {
      // Lookup employee by name, email, or employeeCode
      const found = employees.find((emp) => {
        if (identifier.employeeCode && emp.employeeCode === identifier.employeeCode) return true;
        if (identifier.email && emp.email.toLowerCase() === identifier.email.toLowerCase()) return true;
        if (identifier.name) {
          const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
          if (fullName.includes(identifier.name.toLowerCase())) return true;
        }
        return false;
      });

      if (found) {
        setProfileTarget(found);
        setOpenProfileDialog(true);
      } else {
        // Fallback: Check if matching logged in user details
        const loggedInUser = JSON.parse(localStorage.getItem('smart_jwt_user') || 'null');
        if (loggedInUser) {
          const loggedInName = `${loggedInUser.firstName} ${loggedInUser.lastName}`.toLowerCase();
          const matchesName = identifier.name && loggedInName.includes(identifier.name.toLowerCase());
          const matchesEmail = identifier.email && loggedInUser.email.toLowerCase() === identifier.email.toLowerCase();
          if (matchesName || matchesEmail) {
            setProfileTarget({
              employeeCode: 'EMP-SYSTEM',
              firstName: loggedInUser.firstName,
              lastName: loggedInUser.lastName,
              email: loggedInUser.email,
              phone: '+1 555-SYSTEM',
              department: loggedInUser.department || 'Executive Administration',
              designation: loggedInUser.designation || 'System Administrator',
              status: 'ACTIVE',
              salary: 150000,
              skills: ['System Security', 'Enterprise Operations', 'React'],
            });
            setOpenProfileDialog(true);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [employees]);

  useEffect(() => {
    if (isAuthenticated) {
      const currentItem = MODULE_ITEMS.find((m) => m.id === activeModuleId);
      if (!currentItem || !currentItem.allowedRoles.includes(activeRole)) {
        if (activeRole === 'ADMIN') {
          setActiveModuleId('admin_dashboard');
        } else {
          setActiveModuleId('employee_dashboard');
        }
      }
    }
  }, [isAuthenticated, activeRole, activeModuleId]);

  const theme = getAzureTheme(themeMode);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const activeModuleItem = MODULE_ITEMS.find((m) => m.id === activeModuleId) || MODULE_ITEMS[0];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Global Axios Loading Bar */}
      {isApiLoading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            height: 3,
            bgcolor: 'rgba(59, 130, 246, 0.2)',
            '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
          }}
        />
      )}

      {!isAuthenticated ? (
        <LoginView />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* Header */}
          <AzureHeader
            themeMode={themeMode}
            onToggleTheme={toggleTheme}
            onOpenSwagger={() => setOpenSwaggerModal(true)}
            activeModuleTitle={activeModuleItem.title}
            onLogout={() => setOpenLogoutConfirm(true)}
          />

          <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
            {/* Navigation Sidebar */}
            <Sidebar
              activeModuleId={activeModuleId}
              onSelectModule={(id) => {
                if (id === 'module7_swagger') {
                  setOpenSwaggerModal(true);
                } else {
                  setActiveModuleId(id);
                }
              }}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              onLogout={() => setOpenLogoutConfirm(true)}
            />

            {/* Main Content Area guarded by ProtectedRoute */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 0,
                bgcolor: 'background.default',
                overflowX: 'hidden',
                minHeight: 'calc(100vh - 48px)',
              }}
            >
              <ProtectedRoute
                allowedRoles={activeModuleItem.allowedRoles}
                onNavigateToAllowed={() => setActiveModuleId('employee_dashboard')}
              >
                {activeModuleId === 'admin_dashboard' && (
                  <AdminDashboard onNavigateModule={(id) => setActiveModuleId(id)} />
                )}

                {activeModuleId === 'employee_dashboard' && <EmployeeDashboard />}

                {activeModuleId === 'employee_tasks' && <EmployeeDashboard filter="assigned" />}

                {activeModuleId === 'employee_completed' && <EmployeeDashboard filter="completed" />}

                {activeModuleId === 'employee_deadlines' && <EmployeeDashboard filter="deadlines" />}

                {activeModuleId === 'module2_employees' && <EmployeeModuleView />}

                {activeModuleId === 'module3_projects' && <ProjectTaskModuleView defaultTab={0} />}

                {activeModuleId === 'module3_tasks' && <ProjectTaskModuleView defaultTab={1} />}

                {activeModuleId === 'module4_reports' && <ReportsModuleView />}

                {activeModuleId === 'module5_profile' && <ProfileSettingsView />}

                {activeModuleId === 'module5_settings' && <SettingsView />}
              </ProtectedRoute>
            </Box>
          </Box>

          {/* Global Modals */}
          <SwaggerInspector open={openSwaggerModal} onClose={() => setOpenSwaggerModal(false)} />
          <UserProfileDialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} employee={profileTarget} />

          {/* Logout Confirmation Dialog */}
          <Dialog open={openLogoutConfirm} onClose={() => setOpenLogoutConfirm(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
              Confirm Sign Out
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 2.5 }}>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Are you sure you want to log out of the Smart Management Portal? Your active secure session will be ended.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button onClick={() => setOpenLogoutConfirm(false)} color="secondary">Cancel</Button>
              <Button
                onClick={() => {
                  setOpenLogoutConfirm(false);
                  logout();
                }}
                variant="contained"
                color="error"
                sx={{ fontWeight: 700 }}
              >
                Logout
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Global Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={hideSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', fontWeight: 700 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
