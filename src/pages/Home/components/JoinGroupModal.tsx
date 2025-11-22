import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useJoinGroup } from '@/hooks/UseGroup';

const joinGroupSchema = z.object({
    inviteCode: z
        .string().trim().length(6, 'Invite code must be 6 characters'),
});

type JoinGroupFormData = z.infer<typeof joinGroupSchema>;

interface JoinGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JoinGroupModal({ open, onOpenChange }: JoinGroupModalProps) {
  const joinGroup = useJoinGroup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JoinGroupFormData>({
    resolver: zodResolver(joinGroupSchema),
  });

  const onSubmit = async (data: JoinGroupFormData) => {
    console.log(data.inviteCode);
    await joinGroup.mutateAsync(data.inviteCode);
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Group</DialogTitle>
          <DialogDescription>
            Enter the invite code shared by your teacher to join their group.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              placeholder="Enter invite code (e.g., yFamZr)"
              {...register('inviteCode')}
              
            />
            {errors.inviteCode && (
              <p className="text-sm text-red-500">{errors.inviteCode.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Joining...' : 'Join Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
