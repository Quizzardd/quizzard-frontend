'use client';
import { useReducer, useEffect } from 'react';
import { authService } from '@/services/authService';
import { AuthContext } from '@/contexts/AuthContext';
import type { IUser } from '@/types';
import type { IRegisterPayload } from '@/types/registerPayload';
import { AUTH_ACTIONS } from '@/constants/authActions';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/apiError';

type AuthState = {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: localStorage.getItem('userToken') || null,
  user: null,
  isAuthenticated: !!localStorage.getItem('userToken'),
  isLoading: false,
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

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { token } });

          toast.success('Logged in successfully');
        } catch (error) {
          console.log(error);
          toast.error(getApiErrorMessage(error, 'Failed to load user'));
          localStorage.removeItem('userToken');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
    };
    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const token = await authService.login(email, password);
      localStorage.setItem('userToken', token);

      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { token } });
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

  // 🧾 Register
  const register = async (data: IRegisterPayload) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const res = await authService.register(data);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: { error: null } });
      toast.success(res?.message);
      return { success: true, data: res };
    } catch (error) {
      console.log('error at registr: ', error);
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
    await authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    localStorage.removeItem('userToken');
  };

  const value = {
    token: state.token,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
