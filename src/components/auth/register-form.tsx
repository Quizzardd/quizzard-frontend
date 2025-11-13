'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm({ className, ...props }: React.ComponentProps<'form'>) {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: RegisterValues) => {
    try {
      console.log('🪄 Login values:', values);
      // await apiClient.post('/user/login', values)
      // handle token + redirect
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to sign up
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" placeholder="John Doe" {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </Button>
      </FieldGroup>
    </form>
  );
}
