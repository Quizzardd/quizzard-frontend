import { useState } from 'react';
import { GenericTable } from '../ViewTable';
import { useAdminGroups, useDeleteGroupPermanently } from '@/hooks/useAdmin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminCourses() {
  const { data: groups, isLoading } = useAdminGroups();
  const deleteGroupMutation = useDeleteGroupPermanently();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Transform group data for the table
  const data =
    groups?.map((group: any) => ({
      id: group._id,
      Title: group.title,
      Owner: `${group.owner?.firstName || ''} ${group.owner?.lastName || ''}`,
      'Invite Code': group.inviteCode || 'N/A',
      Status: group.isArchived ? 'Archived' : 'Active',
      Created: new Date(group.createdAt).toLocaleDateString(),
    })) || [];

  const columns = ['Title', 'Owner', 'Invite Code', 'Status', 'Created'];

  const onDelete = (id: string | number): void => {
    setSelectedGroupId(id as string);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedGroupId) {
      deleteGroupMutation.mutate(selectedGroupId);
      setDeleteDialogOpen(false);
      setSelectedGroupId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading groups...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-5">
        <GenericTable
          data={data}
          columns={columns}
          onDelete={onDelete}
          title="Groups"
        ></GenericTable>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this group and all associated data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-accent hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
