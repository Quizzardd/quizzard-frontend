/**
 * Axios API Client Configuration
 * Updated frontend implementation matching the backend refresh token system
 *
 * Features:
 * - HTTP-only cookie-based refresh tokens (XSS protection)
 * - Automatic token refresh on 401
 * - Request queuing during refresh
 * - sessionStorage for access token (cleared on browser close)
 * - Production-ready error handling
 */
import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// --- Types ---
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  accessToken: string;
}

const apiClient: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://quizard-backend-534916389595.europe-west1.run.app/api/v1',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
  withCredentials: true, // ⭐ CRITICAL: Send/receive HTTP-only cookies
});

// Store access token in memory/sessionStorage (cleared on browser close)
let accessToken: string | null = sessionStorage.getItem('accessToken');
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Request interceptor ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// --- Response interceptor ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Skip refresh for auth-related endpoints
    if (
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes('/users/login') ||
      originalRequest.url?.includes('/users/register') ||
      originalRequest.url?.includes('/users/refresh-token') ||
      originalRequest.url?.includes('/users/confirm-email')
    ) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      if (isRefreshing) {
        // Queue requests during refresh
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token endpoint
        // Refresh token is automatically sent from HTTP-only cookie
        const response = await apiClient.post<RefreshTokenResponse>('/users/refresh-token');
        const newToken = response.data.accessToken;

        if (!newToken) throw new Error('No token received from refresh endpoint');

        // Update access token in memory and storage
        accessToken = newToken;
        sessionStorage.setItem('accessToken', newToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - clear auth and redirect to login
        const err =
          refreshError instanceof Error ? refreshError : new Error('Token refresh failed');

        processQueue(err, null);
        accessToken = null;
        sessionStorage.removeItem('accessToken');
        delete apiClient.defaults.headers.common.Authorization;

        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

// --- Helper Functions ---

/**
 * Initialize authentication from sessionStorage on app load
 * Call this in your App component's useEffect
 */
export const initializeAuth = (): void => {
  const storedToken = sessionStorage.getItem('accessToken');
  if (storedToken) {
    accessToken = storedToken;
    apiClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
  }
};

/**
 * Set access token after successful login
 * @param token - The new access token from login response
 */
export const setAccessToken = (token: string): void => {
  accessToken = token;
  sessionStorage.setItem('accessToken', token);
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

/**
 * Clear authentication tokens on logout
 */
export const clearAuth = (): void => {
  accessToken = null;
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('userRole');
  delete apiClient.defaults.headers.common.Authorization;
  // Refresh token in HTTP-only cookie is cleared by server on logout
};

/**
 * Get current access token
 * @returns Current access token or null if not authenticated
 */
export const getAccessToken = (): string | null => {
  return accessToken;
};

/**
 * Check if user is authenticated
 * @returns true if access token exists
 */
export const isAuthenticated = (): boolean => {
  return accessToken !== null;
};
