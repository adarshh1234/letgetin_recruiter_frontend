import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  withCredentials: true, // Enables sending HTTP-only cookies (accessToken & refreshToken)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000,
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor for unified response extraction & automatic token refresh on 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response ? error.response.status : null;

    // Check if error is 401 Unauthorized and not already retrying, and not an unauthenticated action endpoint
    const isNonRefreshableEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/google') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/logout') ||
      originalRequest.url?.includes('/auth/send-email-otp') ||
      originalRequest.url?.includes('/auth/verify-email-otp') ||
      originalRequest.url?.includes('/auth/send-whatsapp-otp') ||
      originalRequest.url?.includes('/auth/verify-whatsapp-otp') ||
      originalRequest.url?.includes('/auth/send-otp') ||
      originalRequest.url?.includes('/auth/verify-otp') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/register');

    if (status === 401 && !originalRequest._retry && !isNonRefreshableEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request token refresh from backend (which uses HTTPOnly refreshToken cookie)
        await axios.post(
          `${NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        // Only redirect to /auth if currently on a protected route and not already on /auth
        const PROTECTED_PREFIXES = [
          '/resume',
          '/builder',
          '/demo',
          '/explore',
          '/settings',
          '/account',
          '/profile',
          '/history',
          '/download',
          '/ats',
          '/drive',
          '/myhub',
          '/geniustest',
          '/exams',
          '/edupie',
          '/mydive',
          '/recruiter',
        ];

        const isProtectedRoute =
          typeof window !== 'undefined' &&
          PROTECTED_PREFIXES.some((prefix) => window.location.pathname.startsWith(prefix));

        if (typeof window !== 'undefined' && isProtectedRoute && !window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth';
        }
        return Promise.reject(
          error.response?.data || {
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Session expired. Please log in again.' },
          }
        );
      }
    }

    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Unable to connect to backend server',
      },
    });
  }
);
