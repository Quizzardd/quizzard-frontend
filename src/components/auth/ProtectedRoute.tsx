import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

type ProtectedRouteProps = {
  allowedRoles?: string[];
  redirectTo?: string;
};

export const ProtectedRoute = ({ allowedRoles, redirectTo = ROUTES.AUTH }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Not authenticated -> redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access
  if (allowedRoles && user) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    if (!hasRequiredRole) {
      // User doesn't have required role -> redirect to home or unauthorized page
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  // All checks passed -> render child routes
  return <Outlet />;
};
