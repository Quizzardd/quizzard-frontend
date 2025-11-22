// src/lib/apiError.ts
import type { AxiosError } from 'axios';

export const getApiErrorMessage = (err: unknown, fallback = 'Something went wrong') => {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as AxiosError<{ err_msg: string } | { message: string }>;
    const data = axiosErr.response?.data;
    console.log(data);
    if (data && 'err_msg' in data) {
      return data.err_msg || fallback;
    }
    if (data && 'message' in data) {
      return data.message || fallback;
    }
  }
  return fallback;
};
