'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/config/routes';
import toast from 'react-hot-toast';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login, loginWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: LoginValues) => {
    try {
      setLoading(true);
      const result = await login({
        email: values.email,
        password: values.password,
      });

      console.log('Login result:', result);
      console.log('User role:', result.user?.role);

      if (result.success && result.user) {
        // Navigate to admin dashboard if user is admin, otherwise to home
        if (result.user.role === 'admin') {
          console.log('Navigating to admin dashboard');
          navigate(ROUTES.ADMIN);
        } else {
          console.log('Navigating to home');
          navigate(ROUTES.HOME);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      // Use the credential (id_token) from Google
      if (!credentialResponse.credential) {
        toast.error('Google login failed - no credential received');
        return;
      }
      const result = await loginWithGoogle(credentialResponse.credential);
      if (result.success && result.user) {
        // Navigate to admin dashboard if user is admin, otherwise to home
        if (result.user.role === 'admin') {
          navigate(ROUTES.ADMIN);
        } else {
          navigate(ROUTES.HOME);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a href="#" className="text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </Field>

        <Button type="submit" disabled={loading || isSubmitting}>
          {loading || isSubmitting ? 'Logging in...' : 'Login'}
        </Button>

        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <div className="text-center text-sm text-muted-foreground">Or continue with</div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                width="100%"
              />
            </div>
          </>
        )}
      </FieldGroup>
    </form>
  );
}
