'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useLeaveGroup } from '@/hooks/UseGroup';

interface LeaveGroupDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  groupTitle: string;
}

export default function LeaveGroupDialog({
  open,
  onClose,
  groupId,
  groupTitle,
}: LeaveGroupDialogProps) {
  const leaveGroup = useLeaveGroup();

  const handleLeave = async () => {
    await leaveGroup.mutateAsync(groupId);
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave "{groupTitle}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this group? You will lose access to all modules,
            materials, and assignments. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className="bg-transparent border border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleLeave}
            disabled={leaveGroup.isPending}
          >
            {leaveGroup.isPending ? 'Leaving...' : 'Leave Group'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
