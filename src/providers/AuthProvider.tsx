'use client';
import { useReducer, useEffect } from 'react';
import { authService } from '@/services/authService';
import { AuthContext } from '@/contexts/AuthContext';
import { setAccessToken, clearAuth, initializeAuth } from '@/config/axiosConfig';
import type { IUser } from '@/types';
import type { IRegisterPayload } from '@/types/registerPayload';
import { AUTH_ACTIONS } from '@/constants/authActions';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/apiError';
import { useQueryClient } from '@tanstack/react-query';

type AuthState = {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const bootstrapToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;

const initialState: AuthState = {
  token: bootstrapToken,
  user: null,
  isAuthenticated: Boolean(bootstrapToken),
  isLoading: Boolean(bootstrapToken),
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user?: IUser } }
  | { type: 'LOGIN_FAILURE'; payload: { error: string | null } }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return { ...state, isLoading: true, error: null };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user ?? null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    case AUTH_ACTIONS.LOGOUT:
      return { token: null, user: null, isAuthenticated: false, isLoading: false, error: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        return;
      }

      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      // Initialize auth from sessionStorage
      initializeAuth();

      try {
        const user = await authService.getUser(token);
        if (user) {
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { token, user: user.data } });
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.log(error);
        toast.error(getApiErrorMessage(error, 'Failed to load user'));
        clearAuth();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };
    loadUser();
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const { accessToken, role } = await authService.login(email, password);
      setAccessToken(accessToken);
      if (role) {
        sessionStorage.setItem('userRole', role);
      }

      const user = await authService.getUser(accessToken);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token: accessToken, user: user.data },
      });
      toast.success('Logged in successfully');

      return { success: true };
    } catch (error) {
      const message = getApiErrorMessage(error, 'Login failed');
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: message },
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const loginWithGoogle = async (token: string) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const { accessToken, user, isNewUser } = await authService.loginWithGoogle(token);

      console.log('Google login response:', { accessToken, user, isNewUser });

      if (!accessToken) {
        throw new Error('No access token received from server');
      }

      setAccessToken(accessToken);
      if (user.role) {
        sessionStorage.setItem('userRole', user.role);
      }

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token: accessToken, user },
      });

      if (isNewUser) {
        toast.success('Welcome! Your account has been created.');
      } else {
        toast.success('Logged in successfully with Google');
      }

      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      const message = getApiErrorMessage(error, 'Google login failed');
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: message },
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // 🧾 Register
  const register = async (data: IRegisterPayload) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const res = await authService.register(data);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: { error: null } });
      toast.success(res?.message);
      return { success: true, data: res };
    } catch (error) {
      const message = getApiErrorMessage(error, 'Registration failed');
      toast.error(message);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: message },
      });
      return { success: false, error: message };
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: { error: null } });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      clearAuth();
      queryClient.clear(); // Clear all React Query cache
      toast.success('Logged out successfully');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Logout failed');
      toast.error(message);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      clearAuth();
      queryClient.clear(); // Clear all React Query cache
    }
  };

  const value = {
    token: state.token,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    loginWithGoogle,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
