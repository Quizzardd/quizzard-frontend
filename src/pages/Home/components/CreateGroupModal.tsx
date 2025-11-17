'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

const createGroupSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  coverUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const { mutate: createGroup, isPending } = useCreateGroup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      title: '',
      coverUrl: '',
    },
  });

  const onSubmit = async (data: CreateGroupFormData) => {
    const payload = {
      title: data.title,
      ...(data.coverUrl && { coverUrl: data.coverUrl }),
    };

    createGroup(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
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

          {/* Cover URL Field */}
          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image URL (Optional)</Label>
            <Input
              id="coverUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register('coverUrl')}
              aria-invalid={errors.coverUrl ? 'true' : 'false'}
            />
            {errors.coverUrl && (
              <p className="text-sm text-destructive">{errors.coverUrl.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending || isSubmitting}
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
