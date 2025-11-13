'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { Button } from '@/components/ui/button';

type AuthFormSwitcherProps = {
  isLogin: boolean;
  setIsLogin: (v: boolean) => void;
};

export function AuthFormSwitcher({ isLogin, setIsLogin }: AuthFormSwitcherProps) {
  return (
    <div className="relative w-full sm:max-w-lg max-w-xs">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <LoginForm />
            <p className="text-center text-sm mt-4">
              Don’t have an account?{' '}
              <Button variant="link" className="p-0 text-primary" onClick={() => setIsLogin(false)}>
                Sign up
              </Button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <RegisterForm />
            <p className="text-center text-sm mt-4">
              Already have an account?{' '}
              <Button variant="link" className="p-0 text-primary" onClick={() => setIsLogin(true)}>
                Login
              </Button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
