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
import { useUpdateGroup } from '@/hooks/UseGroup';

const editGroupSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  coverUrl: z
    .union([z.string().url('Must be a valid URL'), z.literal('')])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
});

type EditGroupFormData = z.infer<typeof editGroupSchema>;

interface EditGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  currentTitle: string;
  currentCoverUrl?: string;
}

export default function EditGroupModal({
  open,
  onClose,
  groupId,
  currentTitle,
  currentCoverUrl,
}: EditGroupModalProps) {
  const { mutate: updateGroup, isPending } = useUpdateGroup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditGroupFormData>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      title: currentTitle,
      coverUrl: currentCoverUrl || '',
    },
  });

  const onSubmit = async (data: EditGroupFormData) => {
    const payload = {
      title: data.title,
      ...(data.coverUrl && { coverUrl: data.coverUrl }),
    };

    updateGroup(
      { groupId, payload },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    reset({
      title: currentTitle,
      coverUrl: currentCoverUrl || '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Group</DialogTitle>
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
            <Button type="submit" disabled={isPending || isSubmitting} className="cursor-pointer md:ms-2">
              {isPending || isSubmitting ? 'Updating...' : 'Update Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
