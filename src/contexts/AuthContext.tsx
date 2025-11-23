import type { IRegisterPayload, IUser } from '@/types';
import { createContext } from 'react';

export type AuthContextType = {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; user?: IUser }>;
  loginWithGoogle: (token: string) => Promise<{ success: boolean; error?: string; user?: IUser }>;
  logout: () => Promise<void>;
  register: (
    registerPayload: IRegisterPayload,
  ) => Promise<{ success: boolean; error?: string; data?: unknown }>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
