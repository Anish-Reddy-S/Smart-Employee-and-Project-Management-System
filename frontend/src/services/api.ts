import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, JwtResponse, Role, User } from '../types';

export const TOKEN_KEY = 'smart_jwt_token';
export const REFRESH_TOKEN_KEY = 'smart_refresh_token';
export const USER_KEY = 'smart_jwt_user';

export interface SnackbarNotification {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

type LoadingCallback = (isLoading: boolean) => void;
type SnackbarCallback = (notification: SnackbarNotification) => void;
type LogoutCallback = () => void;

class ApiEventBus {
  private loadingListeners: Set<LoadingCallback> = new Set();
  private snackbarListeners: Set<SnackbarCallback> = new Set();
  private logoutListeners: Set<LogoutCallback> = new Set();
  private viewProfileListeners: Set<(id: { name?: string; email?: string; employeeCode?: string }) => void> = new Set();

  subscribeLoading(cb: LoadingCallback) {
    this.loadingListeners.add(cb);
    return () => this.loadingListeners.delete(cb);
  }

  subscribeSnackbar(cb: SnackbarCallback) {
    this.snackbarListeners.add(cb);
    return () => this.snackbarListeners.delete(cb);
  }

  subscribeLogout(cb: LogoutCallback) {
    this.logoutListeners.add(cb);
    return () => this.logoutListeners.delete(cb);
  }

  subscribeViewProfile(cb: (id: { name?: string; email?: string; employeeCode?: string }) => void) {
    this.viewProfileListeners.add(cb);
    return () => this.viewProfileListeners.delete(cb);
  }

  emitLoading(isLoading: boolean) {
    this.loadingListeners.forEach((cb) => cb(isLoading));
  }

  emitSnackbar(message: string, severity: SnackbarNotification['severity'] = 'error') {
    this.snackbarListeners.forEach((cb) => cb({ message, severity }));
  }

  emitAutoLogout() {
    this.logoutListeners.forEach((cb) => cb());
  }

  emitViewProfile(identifier: { name?: string; email?: string; employeeCode?: string }) {
    this.viewProfileListeners.forEach((cb) => cb(identifier));
  }
}

export const apiEvents = new ApiEventBus();

const API = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    apiEvents.emitLoading(true);
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    apiEvents.emitLoading(false);
    return Promise.reject(error);
  }
);

// Response Interceptor
API.interceptors.response.use(
  (response) => {
    apiEvents.emitLoading(false);
    return response;
  },
  async (error: AxiosError<any>) => {
    apiEvents.emitLoading(false);
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      // Network error or server offline
      apiEvents.emitSnackbar(
        'Network Error: Unable to communicate with Spring Boot REST Backend. Check your connection.',
        'error'
      );
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // 401 Unauthorized
    if (status === 401) {
      if (originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/api/auth/refresh')) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (refreshToken) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return API(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          isRefreshing = true;
          try {
            const refreshRes = await axios.post('/api/auth/refresh', { refreshToken });
            if (refreshRes.data?.data?.token) {
              const newToken = refreshRes.data.data.token;
              const newRefreshToken = refreshRes.data.data.refreshToken;

              localStorage.setItem(TOKEN_KEY, newToken);
              if (newRefreshToken) {
                localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
              }

              processQueue(null, newToken);
              isRefreshing = false;

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              apiEvents.emitSnackbar('JWT Access Token refreshed automatically via Spring Security', 'info');
              return API(originalRequest);
            }
          } catch (refreshErr) {
            processQueue(refreshErr as AxiosError, null);
            isRefreshing = false;
          }
        }
      }

      // If refresh failed or no refresh token, execute Automatic Logout
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      apiEvents.emitAutoLogout();
      apiEvents.emitSnackbar('401 Unauthorized: Session expired. Automatic logout executed.', 'error');
      return Promise.reject(error);
    }

    // 403 Forbidden
    if (status === 403) {
      const msg = data?.message || '403 Forbidden: Access Denied due to insufficient RBAC privileges.';
      apiEvents.emitSnackbar(msg, 'warning');
      return Promise.reject(error);
    }

    // 404 Not Found
    if (status === 404) {
      const msg = data?.message || '404 Not Found: Requested endpoint or entity does not exist.';
      apiEvents.emitSnackbar(msg, 'error');
      return Promise.reject(error);
    }

    // 400 Bad Request / Validation Errors
    if (status === 400) {
      let msg = data?.message || '400 Bad Request: DTO Validation Error';
      if (Array.isArray(data?.errors)) {
        const details = data.errors
          .map((e: any) => (typeof e === 'object' ? `${e.field}: ${e.message}` : e))
          .join(' | ');
        msg = `Validation Error: ${details}`;
      }
      apiEvents.emitSnackbar(msg, 'warning');
      return Promise.reject(error);
    }

    // 500 Internal Server Error
    if (status >= 500) {
      const msg = data?.message || '500 Internal Server Error: Spring Boot Exception occurred.';
      apiEvents.emitSnackbar(msg, 'error');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username: string, password: string): Promise<ApiResponse<JwtResponse>> => {
    const res = await API.post<ApiResponse<JwtResponse>>('/api/auth/login', { username, password });
    return res.data;
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    department?: string;
    designation?: string;
    role?: string;
  }): Promise<ApiResponse<JwtResponse>> => {
    const res = await API.post<ApiResponse<JwtResponse>>('/api/auth/register', data);
    return res.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> => {
    const res = await API.post<ApiResponse<{ token: string; refreshToken: string }>>('/api/auth/refresh', {
      refreshToken,
    });
    return res.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const res = await API.get<ApiResponse<User>>('/api/auth/me');
    return res.data;
  },

  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const res = await API.get<ApiResponse<User[]>>('/api/users');
    return res.data;
  },

  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    const res = await API.get<ApiResponse<Role[]>>('/api/roles');
    return res.data;
  },

  getHealth: async (): Promise<any> => {
    const res = await API.get('/api/health');
    return res.data;
  },

  getSwaggerSpec: async (): Promise<any> => {
    const res = await API.get('/api/swagger-doc');
    return res.data;
  },
};

export const testErrorService = {
  trigger401: async () => {
    return API.get('/api/test/401');
  },
  trigger403: async () => {
    return API.get('/api/test/403');
  },
  trigger404: async () => {
    return API.get('/api/test/404');
  },
  trigger500: async () => {
    return API.get('/api/test/500');
  },
  triggerValidation: async () => {
    return API.post('/api/test/validation', {});
  },
  triggerNetworkError: async () => {
    // Attempt request to invalid closed port to simulate Network Error
    return axios.get('http://localhost:9999/api/unreachable', { timeout: 1500 });
  },
};

export default API;
