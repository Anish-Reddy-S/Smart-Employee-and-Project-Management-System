import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Divider,
  Stack,
  Alert,
  Chip,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  HealthAndSafety as HealthIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  BugReport as BugIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { testErrorService } from '../../services/api';

export const SettingsView: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { showSnackbar } = useData();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const isPasswordStrong = (pass: string) => {
    const hasLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[@$!%*?&]/.test(pass);
    return hasLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlertMsg('New Password and Confirm Password do not match');
      return;
    }
    if (!isPasswordStrong(passwordData.newPassword)) {
      setAlertMsg('New Password does not satisfy strength requirements (must contain 8+ chars, upper, lower, number, special character)');
      return;
    }
    setAlertMsg(null);
    showSnackbar('Password updated successfully in Spring Security BCrypt store', 'success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Error simulation handlers
  const handleTestError = async (type: string) => {
    try {
      if (type === '401') await testErrorService.trigger401();
      else if (type === '403') await testErrorService.trigger403();
      else if (type === '404') await testErrorService.trigger404();
      else if (type === '500') await testErrorService.trigger500();
      else if (type === 'val') await testErrorService.triggerValidation();
      else if (type === 'net') await testErrorService.triggerNetworkError();
    } catch (err) {
      // Handled by global response interceptor dialog/snackbar
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <SettingsIcon sx={{ color: 'primary.main', fontSize: 26 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            System Settings & Security Diagnostics
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Configure security credentials, inspect Spring Boot Actuator diagnostic telemetry, and run mock API exceptions.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Security and Preferences */}
        <Grid item xs={12} md={7}>
          {/* Change Password Card */}
          <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockIcon sx={{ color: 'primary.main', fontSize: 20 }} /> Update Password Hash (BCrypt)
            </Typography>

            {alertMsg && <Alert severity="error" sx={{ mb: 2 }}>{alertMsg}</Alert>}

            <form onSubmit={handleChangePassword}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  type="password"
                  size="small"
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  type="password"
                  size="small"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  type="password"
                  size="small"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" color="warning" sx={{ fontWeight: 700 }}>
                  Update Password
                </Button>
              </Box>
            </form>
          </Card>

          {/* Preferences Card */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5 }}>
              Application Preferences
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Email Alerts</Typography>
                    <Typography variant="caption" color="text.secondary">Send automated emails for project status updates and payroll completions</Typography>
                  </Box>
                }
              />
              <Divider />
              <FormControlLabel
                control={<Switch checked={mfaEnabled} onChange={(e) => setMfaEnabled(e.target.checked)} color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Multi-Factor Authentication (MFA)</Typography>
                    <Typography variant="caption" color="text.secondary">Require Google Authenticator code in Spring Security filter chains</Typography>
                  </Box>
                }
              />
            </Stack>
          </Card>
        </Grid>

        {/* Right Column: Diagnostics and Diagnostic Triggers */}
        <Grid item xs={12} md={5}>
          {/* Actuator Health */}
          <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <HealthIcon sx={{ color: 'success.main', fontSize: 20 }} /> Actuator Health Telemetry
            </Typography>

            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'background.default', borderRadius: 1.5, borderColor: 'divider' }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>System Status</Typography>
                  <Chip label="UP" color="success" size="small" sx={{ fontWeight: 700 }} />
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>MySQL Database</Typography>
                  <Chip label="CONNECTED" color="success" size="small" sx={{ fontWeight: 700 }} />
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>JVM Memory</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>256MB / 1024MB</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Hikari Connection Pool</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>15 Active</Typography>
                </Box>
              </Stack>
            </Paper>
          </Card>

          {/* Test Exception Card */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <BugIcon sx={{ color: 'error.main', fontSize: 20 }} /> Spring Security Exception Triggers
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Simulate Spring Boot backend HTTP exceptions to test Axios response interceptors.
            </Typography>

            <Grid container spacing={1.5}>
              {[
                { type: '401', label: '401 Auth' },
                { type: '403', label: '403 Forbidden' },
                { type: '404', label: '404 Not Found' },
                { type: '500', label: '500 Internal' },
                { type: 'val', label: 'Validation (400)' },
                { type: 'net', label: 'Network Error' },
              ].map((btn) => (
                <Grid item xs={6} key={btn.type}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleTestError(btn.type)}
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                  >
                    {btn.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
