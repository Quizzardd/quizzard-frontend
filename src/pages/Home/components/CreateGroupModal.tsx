'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateGroup } from '@/hooks/UseGroup';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const createGroupSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const { mutate: createGroup, isPending } = useCreateGroup();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      title: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data: CreateGroupFormData) => {
    const payload = {
      title: data.title,
      ...(selectedFile && { coverUrl: selectedFile }),
    };

    createGroup(payload, {
      onSuccess: () => {
        reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Group Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Computer Science 101"
              {...register('title')}
              aria-invalid={errors.title ? 'true' : 'false'}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          {/* Cover Image Upload Field */}
          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image (Optional)</Label>
            
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="w-full h-40 object-cover rounded-lg border-2 border-border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <label htmlFor="coverUrl" className="cursor-pointer block">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
                <Input
                  id="coverUrl"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-4 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending || isSubmitting}
              className='me-2'
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isSubmitting} className="cursor-pointer">
              {isPending || isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
