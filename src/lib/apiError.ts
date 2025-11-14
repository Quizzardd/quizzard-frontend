// src/lib/apiError.ts
import type { AxiosError } from 'axios';

export const getApiErrorMessage = (err: unknown, fallback = 'Something went wrong') => {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as AxiosError<{ err_msg: string }>;
    return axiosErr.response?.data?.err_msg || fallback;
  }
  return fallback;
};
