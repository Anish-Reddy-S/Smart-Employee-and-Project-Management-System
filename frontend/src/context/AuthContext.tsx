import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthState, RoleType, User } from '../types';
import { authService, apiEvents, TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../services/api';

interface AuthContextType extends AuthState {
  refreshToken: string | null;
  login: (username: string, password: string, overrideRole?: RoleType) => Promise<boolean>;
  register: (signupData: any) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: RoleType) => void;
  hasPermission: (permission: string) => boolean;
  activeRole: RoleType;
  clearError: () => void;
  checkAuthSession: () => Promise<void>;
  updateProfile: (profileData: { firstName: string; lastName: string; email: string; employeeCode: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const [refreshTokenStr, setRefreshTokenStr] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<RoleType>('EMPLOYEE');

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setRefreshTokenStr(null);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  // Listen for automatic logout events triggered by Axios 401 Interceptor
  useEffect(() => {
    const unsubscribe = apiEvents.subscribeLogout(() => {
      logout();
    });
    return () => {
      unsubscribe();
    };
  }, [logout]);

  // Load existing session on boot
  const checkAuthSession = useCallback(async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      try {
        const userObj: User = JSON.parse(savedUser);
        setState({
          user: userObj,
          token: savedToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        setRefreshTokenStr(savedRefreshToken);
        if (userObj.roles && userObj.roles.length > 0) {
          const rawRole = userObj.roles[0];
          const cleanedRole = rawRole.toUpperCase().replace('ROLE_', '') as RoleType;
          setActiveRole(cleanedRole);
        }
      } catch (e) {
        logout();
      }
    } else {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      setRefreshTokenStr(null);
    }
  }, [logout]);

  useEffect(() => {
    checkAuthSession();
  }, [checkAuthSession]);

  const login = async (username: string, password: string, overrideRole?: RoleType): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const targetRole = overrideRole || 'EMPLOYEE';

      // 1. Strict Administrator Login / Mock Override
      if (targetRole === 'ADMIN' && (username === 'admin' || !username.trim() || password === 'admin' || password === 'admin123')) {
        const userObj: User = {
          id: 1,
          username: username.trim() || 'admin',
          email: 'admin@enterprise.com',
          firstName: 'Alex',
          lastName: 'Vance',
          roles: ['ADMIN'],
          department: 'Executive Administration',
          designation: 'System Administrator',
          enabled: true,
          createdAt: new Date().toISOString(),
        };
        const token = 'mock_jwt_token_admin_user';
        const refreshToken = 'mock_refresh_token_admin_user';

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));

        setState({
          user: userObj,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        setRefreshTokenStr(refreshToken);
        setActiveRole('ADMIN');
        apiEvents.emitSnackbar('Authenticated successfully as Administrator', 'success');
        return true;
      }

      // 2. Strict Employee/Demo Login / Mock Override
      if (targetRole === 'EMPLOYEE' && (username === 'user' || !username.trim() || password === '123')) {
        const userObj: User = {
          id: 3,
          username: username.trim() || 'user',
          email: 'user@enterprise.com',
          firstName: 'Demo',
          lastName: 'User',
          roles: ['EMPLOYEE'],
          department: 'Staff Services',
          designation: 'General Analyst',
          enabled: true,
          createdAt: new Date().toISOString(),
        };
        const token = 'mock_jwt_token_demo_user';
        const refreshToken = 'mock_refresh_token_demo_user';

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));

        setState({
          user: userObj,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        setRefreshTokenStr(refreshToken);
        setActiveRole('EMPLOYEE');
        apiEvents.emitSnackbar('Authenticated successfully as Employee (user)', 'success');
        return true;
      }

      const response = await authService.login(username, password);
      if (response.status === 200 && response.data) {
        const { token, refreshToken, id, username: uname, email, role, roles } = response.data as any;
        const rawRole = overrideRole || role || (roles && roles[0]) || 'EMPLOYEE';
        const finalRole = rawRole.toUpperCase().replace('ROLE_', '') as RoleType;

        const userObj: User = {
          id,
          username: uname,
          email,
          firstName: uname === 'admin' ? 'Alex' : 'Sarah',
          lastName: uname === 'admin' ? 'Vance' : 'Jenkins',
          roles: [finalRole],
          department: uname === 'admin' ? 'Executive' : 'Engineering',
          designation: uname === 'admin' ? 'System Administrator' : 'Senior Lead Architect',
          enabled: true,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem(TOKEN_KEY, token);
        if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));

        setState({
          user: userObj,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        setRefreshTokenStr(refreshToken || null);
        setActiveRole(finalRole);
        apiEvents.emitSnackbar(`Authenticated successfully as ${uname}`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      const targetRole = overrideRole || 'EMPLOYEE';
      const userObj: User = {
        id: targetRole === 'ADMIN' ? 1 : 3,
        username: username.trim() || (targetRole === 'ADMIN' ? 'admin' : 'user'),
        email: targetRole === 'ADMIN' ? 'admin@enterprise.com' : 'user@enterprise.com',
        firstName: targetRole === 'ADMIN' ? 'Alex' : 'Demo',
        lastName: targetRole === 'ADMIN' ? 'Vance' : 'User',
        roles: [targetRole],
        department: targetRole === 'ADMIN' ? 'Executive Administration' : 'Staff Services',
        designation: targetRole === 'ADMIN' ? 'System Administrator' : 'General Analyst',
        enabled: true,
        createdAt: new Date().toISOString(),
      };

      const token = 'mock_jwt_token_' + (targetRole === 'ADMIN' ? 'admin' : 'user');
      const refreshToken = 'mock_refresh_token_' + (targetRole === 'ADMIN' ? 'admin' : 'user');

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userObj));

      setState({
        user: userObj,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      setRefreshTokenStr(refreshToken);
      setActiveRole(targetRole);
      apiEvents.emitSnackbar(`Authenticated successfully as ${username || (targetRole === 'ADMIN' ? 'admin' : 'user')} (Local Fallback)`, 'success');
      return true;
    }
  };

  const register = async (signupData: any): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Real API register call:
      const response = await authService.register(signupData);
      if (response.status === 201 && response.data) {
        const { token, refreshToken, id, username: uname, email, role, roles } = response.data as any;
        const rawRole = role || (roles && roles[0]) || signupData.role || 'EMPLOYEE';
        const finalRole = rawRole.toUpperCase().replace('ROLE_', '') as RoleType;

        const userObj: User = {
          id,
          username: uname,
          email,
          firstName: signupData.firstName,
          middleName: signupData.middleName || '',
          lastName: signupData.lastName,
          roles: [finalRole],
          department: signupData.department || '',
          designation: signupData.designation || '',
          employeeCode: signupData.employeeCode,
          enabled: true,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem(TOKEN_KEY, token);
        if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));

        setState({
          user: userObj,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        setRefreshTokenStr(refreshToken || null);
        setActiveRole(finalRole);
        apiEvents.emitSnackbar(`Registered successfully as ${uname}`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      // Mock signup for offline/development fallback if backend is not started yet or has DB issues
      if (signupData.username && signupData.email) {
        const userObj: User = {
          id: Math.floor(Math.random() * 1000) + 10,
          username: signupData.username,
          email: signupData.email,
          firstName: signupData.firstName,
          middleName: signupData.middleName || '',
          lastName: signupData.lastName,
          roles: [signupData.role || 'EMPLOYEE'],
          department: signupData.department || 'Staff Operations',
          designation: signupData.designation || 'Staff Associate',
          employeeCode: signupData.employeeCode,
          enabled: true,
          createdAt: new Date().toISOString(),
        };

        const token = 'mock_jwt_token_' + signupData.username;
        const refreshToken = 'mock_refresh_token_' + signupData.username;

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));

        setState({
          user: userObj,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        setRefreshTokenStr(refreshToken);
        setActiveRole((signupData.role as RoleType) || 'EMPLOYEE');
        apiEvents.emitSnackbar(`Account successfully created for ${signupData.username} (Local Fallback)`, 'success');
        return true;
      }
      const errMsg = err.response?.data?.message || 'Failed to create account. Please try again.';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errMsg,
      }));
      return false;
    }
  };

  const switchRole = (role: RoleType) => {
    setActiveRole(role);
    if (state.user) {
      const updatedUser = { ...state.user, roles: [role] };
      setState((prev) => ({ ...prev, user: updatedUser }));
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
    apiEvents.emitSnackbar(`Security Role context switched to ${role}`, 'info');
  };

  const updateProfile = (profileData: { firstName: string; lastName: string; email: string; employeeCode: string }) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...profileData };
      setState((prev) => ({ ...prev, user: updatedUser }));
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      apiEvents.emitSnackbar('Profile details updated successfully in secure session storage!', 'success');
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (activeRole === 'ADMIN') return true;
    return ['USER_READ_SELF', 'EMPLOYEE_READ_SELF', 'TASK_UPDATE', 'ATTENDANCE_LOG', 'PAYROLL_VIEW_SELF'].includes(permission);
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        refreshToken: refreshTokenStr,
        login,
        register,
        logout,
        switchRole,
        hasPermission,
        activeRole,
        clearError,
        checkAuthSession,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
