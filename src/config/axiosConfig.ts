import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// --- Types ---
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

interface RefreshTokenResponse {
  userToken: string;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
  withCredentials: true, // send refresh token cookie
});

let accessToken: string | null = localStorage.getItem('userToken');
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
      originalRequest.url?.includes('/users/refresh')
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
        const response = await apiClient.post<RefreshTokenResponse>('/users/refresh');
        const newToken = response.data.userToken;

        if (!newToken) throw new Error('No token received from refresh endpoint');

        // Update tokens
        accessToken = newToken;
        localStorage.setItem('userToken', newToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        const err =
          refreshError instanceof Error ? refreshError : new Error('Token refresh failed');

        processQueue(err, null);
        accessToken = null;
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');

        // Optional: redirect to login
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
