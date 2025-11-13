import { GalleryVerticalEnd, LogIn } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { AuthFormSwitcher } from '@/components/auth/AuthFormSwitcher';
import { cn } from '@/lib/utils';

type BackgroundSectionProps = {
  image: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
};

export function BackgroundSection({
  image,
  icon,
  title,
  subtitle,
  className,
}: BackgroundSectionProps) {
  return (
    <AnimatePresence mode="sync">
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

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left (form) */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          {/* Pass state to the switcher */}
          <AuthFormSwitcher isLogin={isLogin} setIsLogin={setIsLogin} />
        </div>
      </div>

      {/* Right (background) */}
      <div className="relative hidden overflow-hidden lg:block">
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
