import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import profileAvatar from '@/assets/Profile_avatar_placeholder.png';
import { useGetMe, useUpdateProfile, useChangePassword, useUploadPhoto } from '@/hooks/useUser';
import toast from 'react-hot-toast';

/* ------------------------------
   PROFILE VALIDATION SCHEMA
--------------------------------*/
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  age: z.coerce.number().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/* ------------------------------
   PASSWORD VALIDATION SCHEMA
--------------------------------*/
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  // --------------------
  // Hooks
  // --------------------
  const { data: user, isLoading } = useGetMe();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const uploadPhoto = useUploadPhoto();

  const [photoPreview, setPhotoPreview] = useState<string>(profileAvatar);

  // --------------------
  // Forms
  // --------------------
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          age: user.age || undefined,
          gender: user.gender || 'male',
        }
      : undefined,
  });

  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    formState: { errors: pwdErrors, isSubmitting: isPwdSubmitting },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Update form values when user data loads
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        age: user.age || undefined,
        gender: user.gender || 'male',
      });
      setPhotoPreview(user.photoURL || profileAvatar);
    }
  }, [user, reset]);

  // --------------------
  // Handlers
  // --------------------
  const onSubmitProfile = async (data: ProfileFormData) => {
    await updateProfile.mutateAsync(data);
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    await changePassword.mutateAsync(data);
    resetPasswordForm();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Invalid image');
    if (file.size > 2 * 1024 * 1024) return toast.error('Max size is 2MB');

    // Optimistic preview
    setPhotoPreview(URL.createObjectURL(file));

    uploadPhoto.mutate(file, {
      onSuccess: (updatedUser) => {
        setPhotoPreview(updatedUser.photoURL || profileAvatar);
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm m-4 space-y-10">
      <h3 className="text-xl font-semibold text-foreground">Profile Information</h3>

      {/* -----------------------------
          PROFILE IMAGE
      ------------------------------*/}
      <div className="flex items-center gap-6">
        <img
          src={photoPreview}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border border-border"
        />

        <div className="space-y-1">
          <label
            htmlFor="photo"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            Change Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground">JPG, GIF, PNG. Max size 2MB.</p>
        </div>
      </div>

      <hr className="border-border" />

      {/* -----------------------------
          PROFILE FORM
      ------------------------------*/}
      <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              {...register('firstName')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              {...register('lastName')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            {...register('email')}
            className="w-full md:w-1/2 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone - Age - Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              {...register('phone')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              {...register('age')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              {...register('gender')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>

      {/* -----------------------------
          CHANGE PASSWORD FORM
      ------------------------------*/}
      <div className="pt-6 border-t border-border space-y-6">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <form onSubmit={handleSubmitPwd(onSubmitPassword)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              {...registerPwd('currentPassword')}
              className="w-full md:w-1/2 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {pwdErrors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">{pwdErrors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              {...registerPwd('newPassword')}
              className="w-full md:w-1/2 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {pwdErrors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{pwdErrors.newPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPwdSubmitting}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {isPwdSubmitting ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
