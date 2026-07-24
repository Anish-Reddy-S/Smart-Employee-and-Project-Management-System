import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockOutlined as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export const LoginView: React.FC = () => {
  const { login, register, error, isLoading, clearError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');

  // SignUp state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regMiddleName, setRegMiddleName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regDesignation, setRegDesignation] = useState('');
  const [regEmployeeCode, setRegEmployeeCode] = useState('');
  const [regRole, setRegRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
  };

  const isPasswordStrong = (pass: string) => {
    const hasLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[@$!%*?&]/.test(pass);
    return hasLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const isSignupDisabled =
    isSignUp &&
    (!regUsername.trim() ||
      !regEmail.trim() ||
      !regPassword.trim() ||
      !regFirstName.trim() ||
      !regLastName.trim() ||
      !regEmployeeCode.trim() ||
      !isPasswordStrong(regPassword));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (isSignupDisabled) return;
      await register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        firstName: regFirstName.trim(),
        middleName: regMiddleName.trim() || undefined,
        lastName: regLastName.trim(),
        department: regDepartment.trim() || undefined,
        designation: regDesignation.trim() || undefined,
        role: regRole,
        employeeCode: regEmployeeCode.trim(),
      });
    } else {
      await login(username.trim(), password.trim(), loginRole);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)'
            : 'linear-gradient(135deg, #020617 0%, #111827 100%)',
        p: 2,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: isSignUp ? 500 : 420,
          p: 4,
          borderRadius: 2,
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0 8px 30px rgba(0, 0, 0, 0.03)'
              : '0 8px 30px rgba(0, 0, 0, 0.2)',
          bgcolor: 'background.paper',
          borderColor: 'divider',
          transition: 'max-width 0.2s ease-in-out',
        }}
      >
        <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
          {/* Brand/Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                bgcolor: 'primary.main',
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.25rem',
                mx: 'auto',
                mb: 2,
              }}
            >
              SM
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5, mb: 0.5 }}>
              {isSignUp ? 'Create Enterprise Account' : 'Smart Manager Portal'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isSignUp
                ? 'Register your profile to access employee resources'
                : 'Sign in to manage enterprise projects & employees'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" onClose={clearError} sx={{ fontSize: '0.8rem' }}>
              {error}
            </Alert>
          )}

          {isSignUp ? (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  label="Email Address"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  required
                  size="small"
                />
              </Stack>

              <Box>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  required
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Box sx={{ mt: 1, px: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Password Strength Requirements:
                  </Typography>
                  <Grid container spacing={0.5}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color={regPassword.length >= 8 ? 'success.main' : 'text.secondary'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {regPassword.length >= 8 ? '✓' : '•'} Min 8 characters
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color={/[A-Z]/.test(regPassword) ? 'success.main' : 'text.secondary'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {/[A-Z]/.test(regPassword) ? '✓' : '•'} Uppercase letter
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color={/[a-z]/.test(regPassword) ? 'success.main' : 'text.secondary'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {/[a-z]/.test(regPassword) ? '✓' : '•'} Lowercase letter
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color={/[0-9]/.test(regPassword) ? 'success.main' : 'text.secondary'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {/[0-9]/.test(regPassword) ? '✓' : '•'} Number (0-9)
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color={/[@$!%*?&]/.test(regPassword) ? 'success.main' : 'text.secondary'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {/[@$!%*?&]/.test(regPassword) ? '✓' : '•'} Special character (@$!%*?&)
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="First Name"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  label="Middle Name"
                  value={regMiddleName}
                  placeholder="Optional"
                  onChange={(e) => setRegMiddleName(e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  size="small"
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Last Name"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  label="Department"
                  value={regDepartment}
                  placeholder="Optional"
                  onChange={(e) => setRegDepartment(e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  size="small"
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Employee ID"
                  value={regEmployeeCode}
                  placeholder="e.g. EMP-1011"
                  onChange={(e) => setRegEmployeeCode(e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  label="Designation"
                  value={regDesignation}
                  placeholder="Optional"
                  onChange={(e) => setRegDesignation(e.target.value)}
                  disabled={isLoading}
                  fullWidth
                  size="small"
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="reg-role-select-label">Account Role</InputLabel>
                  <Select
                    labelId="reg-role-select-label"
                    value={regRole}
                    label="Account Role"
                    onChange={(e) => setRegRole(e.target.value as 'ADMIN' | 'EMPLOYEE')}
                    disabled={isLoading}
                  >
                    <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </>
          ) : (
            <>
              <FormControl fullWidth size="small" required>
                <InputLabel id="login-role-select-label">Select Role to Sign In</InputLabel>
                <Select
                  labelId="login-role-select-label"
                  value={loginRole}
                  label="Select Role to Sign In"
                  onChange={(e) => setLoginRole(e.target.value as 'ADMIN' | 'EMPLOYEE')}
                  disabled={isLoading}
                >
                  <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                fullWidth
                required
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                fullWidth
                required
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || isSignupDisabled}
            fullWidth
            sx={{ height: 40, fontWeight: 700 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 0.5 }}>
            <Button
              variant="text"
              size="small"
              onClick={handleToggleMode}
              disabled={isLoading}
              sx={{ fontWeight: 600, textTransform: 'none' }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </Button>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};
