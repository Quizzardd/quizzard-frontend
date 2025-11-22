import { useState, useMemo } from 'react';
import { GenericTable } from '../ViewTable';
import { useSearchUsers, useDeleteUser } from '@/hooks/useAdmin';
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

export default function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: users, isLoading } = useSearchUsers(); // Fetch all users
  const deleteUserMutation = useDeleteUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Transform user data for the table and filter on frontend
  const data = useMemo(() => {
    const allUsers =
      users?.map((user: any) => ({
        id: user._id,
        Name: `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Phone: user.phone || 'N/A',
        Role: user.role,
        Joined_Date: new Date(user.createdAt).toLocaleDateString(),
      })) || [];

    // Filter locally based on search query
    if (!searchQuery) return allUsers;

    const query = searchQuery.toLowerCase();
    return allUsers.filter(
      (user: any) =>
        user.Name.toLowerCase().includes(query) ||
        user.Email.toLowerCase().includes(query) ||
        user.Phone.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  const columns = ['Name', 'Email', 'Phone', 'Role', 'Joined_Date'];

  const onDelete = (id: string | number): void => {
    setSelectedUserId(id as string);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      deleteUserMutation.mutate(selectedUserId);
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading users...</p>
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
          title="Users"
          onSearch={setSearchQuery}
        />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user and all their data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
