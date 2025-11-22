'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  age: z.coerce.number().min(13, 'You must be at least 13 years old').optional(),
  gender: z.enum(['male', 'female']).optional(),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm({ className, ...props }: React.ComponentProps<'form'>) {
  const { register: authRegister } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterValues>,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      age: 13,
      gender: 'male',
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      await authRegister(values);
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

        {/* add first name and last name at 1 row */}
        <div className="flex gap-4">
          <Field className="flex-1">
            <FieldLabel htmlFor="firstName">
              First Name<span className="text-red-500">*</span>
            </FieldLabel>
            <Input id="firstName" placeholder="John" {...register('firstName')} />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </Field>
          <Field className="flex-1">
            <FieldLabel htmlFor="lastName">
              Last Name<span className="text-red-500">*</span>
            </FieldLabel>
            <Input id="lastName" placeholder="Doe" {...register('lastName')} />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </Field>
        </div>

        <div className="flex gap-4">
          <Field>
            <FieldLabel htmlFor="email">
              Email
              <span className="text-red-500">*</span>
            </FieldLabel>
            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">
              Password
              <span className="text-red-500">*</span>
            </FieldLabel>
            <Input id="password" type="password" placeholder="********" {...register('password')} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </Field>
        </div>
        <div className="flex gap-4">
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" placeholder="+201234567890" {...register('phone')} />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="age">Age</FieldLabel>
            <Input id="age" type="number" min={13} {...register('age', { valueAsNumber: true })} />
            {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
          </Field>
        </div>

        {/* Gender */}
        <Field>
          <FieldLabel htmlFor="gender">Gender</FieldLabel>
          <select
            id="gender"
            {...register('gender')}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </Field>

        {/* Photo URL */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </Button>
      </FieldGroup>
    </form>
  );
}
