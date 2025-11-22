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
import { useArchiveGroup } from '@/hooks/UseGroup';

interface ArchiveGroupDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  groupTitle: string;
}

export default function ArchiveGroupDialog({
  open,
  onClose,
  groupId,
  groupTitle,
}: ArchiveGroupDialogProps) {
  const { mutate: archiveGroup, isPending } = useArchiveGroup();

  const handleArchive = () => {
    archiveGroup(groupId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive Group</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to archive <strong>"{groupTitle}"</strong>?
            </p>
            <p className="text-muted-foreground">
              Archived groups will be hidden from your active groups list. You can restore them
              later if needed.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleArchive}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? 'Archiving...' : 'Archive Group'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
