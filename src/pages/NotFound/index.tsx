import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(ROUTES.HOME, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        {/* 404 Number */}
        <h1 className="mb-4 text-9xl font-bold text-primary">404</h1>

        {/* Error Message */}
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Countdown */}
        <p className="mb-8 text-sm text-muted-foreground">
          Redirecting to home in <span className="font-bold text-primary">{countdown}</span> second
          {countdown !== 1 ? 's' : ''}...
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate(ROUTES.HOME, { replace: true })} className="gap-2">
            <Home className="h-4 w-4" />
            Go Home Now
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
