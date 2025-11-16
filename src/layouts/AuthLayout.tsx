import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { GalleryVerticalEnd, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthFormSwitcher } from '@/components/auth/AuthFormSwitcher';
import { cn } from '@/lib/utils';

type BackgroundSectionProps = {
  image: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
};

function BackgroundSection({ image, icon, title, subtitle, className }: BackgroundSectionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={title}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        <div className={cn('absolute inset-0', className)}>
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
            <div className="mb-6 flex flex-row items-center gap-2">
              {icon}
              <h1 className="text-4xl font-bold">{title}</h1>
            </div>
            <p className="max-w-sm text-center text-m opacity-90">{subtitle}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const Header = () => (
  <div className="flex justify-center gap-2 md:justify-start">
    <a href="#" className="flex items-center gap-2 font-medium">
      <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <GalleryVerticalEnd className="size-4" />
      </div>
      Quizzard
    </a>
  </div>
);

export function AuthLayout() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? ROUTES.ADMIN : ROUTES.HOME;
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="grid h-svh lg:grid-cols-2 overflow-hidden">
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <AuthFormSwitcher isLogin={isLogin} setIsLogin={setIsLogin} />
        </div>
      </div>

      <div className="relative hidden lg:block">
        {isLogin ? (
          <BackgroundSection
            image="/loginBg.jpg"
            icon={<LogIn className="size-8" />}
            title="Welcome Back!"
            subtitle="Log in to access your account and continue your learning journey with Quizzard."
          />
        ) : (
          <BackgroundSection
            image="/signupBg.jpg"
            icon={<UserPlus className="size-8" />}
            title="Join Our Platform"
            subtitle="Create your account and start your learning adventure today."
          />
        )}
      </div>
    </div>
  );
}
