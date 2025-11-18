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
import { useDeleteGroup } from '@/hooks/UseGroup';

interface DeleteGroupDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  groupTitle: string;
}

export default function DeleteGroupDialog({
  open,
  onClose,
  groupId,
  groupTitle,
}: DeleteGroupDialogProps) {
  const { mutate: deleteGroup, isPending } = useDeleteGroup();

  const handleDelete = () => {
    deleteGroup(groupId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Group Permanently</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to{' '}
              <strong className="text-destructive">permanently delete</strong>{' '}
              <strong>"{groupTitle}"</strong>?
            </p>
            <p className="text-destructive font-medium">
              This action cannot be undone. All group data, members, and content will be permanently
              removed.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
          >
            {isPending ? 'Deleting...' : 'Delete Permanently'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
