import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import type { IUser } from '@/types';

import profileAvatar from '@/assets/Profile_avatar_placeholder.png';

// -----------------
// 🧩 Validation Schema
// -----------------
const profileSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileProps {
  user: IUser;
}

export default function Profile({ user }: ProfileProps) {
  const [photoPreview, setPhotoPreview] = useState<string>(user.photoURL || profileAvatar);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
   // reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    console.log('Updated profile data:', data);
    // TODO: integrate with React Query mutation later
  };

  // -----------------
  // 🖼️ Handle photo upload
  // -----------------
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File too large! Max size 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm m-4 space-y-8">
      <h3 className="text-xl font-semibold text-foreground">Profile Information</h3>

      {/* Profile Image */}
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
          <p className="text-xs text-muted-foreground">JPG, GIF, or PNG. Max size 2MB.</p>
        </div>
      </div>

      <hr className="border-border" />

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              {...register('firstname')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.firstname && (
              <p className="text-xs text-red-500 mt-1">{errors.firstname.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              {...register('lastname')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.lastname && (
              <p className="text-xs text-red-500 mt-1">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            {...register('email')}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              {...register('phone')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              {...register('location')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
    </div>
  );
}
