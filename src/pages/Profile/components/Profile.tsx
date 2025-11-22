import { useState, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
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
  gender: z.enum(['male', 'female']).optional(),
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
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormData>,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto m-6 space-y-6">
      {/* Profile Information Card */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your personal information</p>
        </div>

        <div className="p-6 space-y-8">
          {/* -----------------------------
              PROFILE IMAGE
          ------------------------------*/}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={photoPreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-border shadow-md transition group-hover:border-primary"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="photo"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition cursor-pointer"
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

          {/* -----------------------------
              PROFILE FORM
          ------------------------------*/}
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Personal Details</h3>
              <p className="text-sm text-muted-foreground">Update your personal information</p>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('firstName')}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('lastName')}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                className="w-full md:w-1/2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Phone - Age - Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Age</label>
                <input
                  type="number"
                  {...register('age')}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition cursor-pointer"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-orange-500/10 via-orange-500/5 to-transparent p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Security</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Update your password to keep your account secure
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmitPwd(onSubmitPassword)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...registerPwd('currentPassword')}
                className="w-full md:w-1/2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter current password"
              />
              {pwdErrors.currentPassword && (
                <p className="text-xs text-red-500 mt-1.5">{pwdErrors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...registerPwd('newPassword')}
                className="w-full md:w-1/2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter new password (min. 8 characters)"
              />
              {pwdErrors.newPassword && (
                <p className="text-xs text-red-500 mt-1.5">{pwdErrors.newPassword.message}</p>
              )}
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={isPwdSubmitting}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isPwdSubmitting ? 'Updating Password...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={() => resetPasswordForm()}
                className="px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
