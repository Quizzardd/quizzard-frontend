// AuthRoute.tsx
import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { AuthLayout } from '@/layouts/AuthLayout';

export const AuthRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Not authenticated -> show auth layout (login/register)
  return <AuthLayout />;
};
