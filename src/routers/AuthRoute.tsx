// AuthRoute.tsx
import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { AuthLayout } from '@/layouts/AuthLayout';

export const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Not authenticated -> show auth layout (login/register)
  return <AuthLayout />;
};
