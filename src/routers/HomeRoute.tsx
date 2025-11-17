// HomeRoute.tsx (for the landing page at "/")
import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

export const HomeRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If authenticated, go to main app home
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Not authenticated -> show landing/marketing page
  // If you don't have a separate landing page, redirect to auth
  return <Navigate to={ROUTES.AUTH} replace />;
  // OR if you have a public landing page:
  // return <LandingPage />;
};
