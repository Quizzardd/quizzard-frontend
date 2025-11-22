import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Save, X, Loader2, MoreVertical } from 'lucide-react';
import { useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncement';
import { useAuth } from '@/hooks/useAuth';
import type { IAnnouncement } from '@/types/announcements';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AnnouncementCardProps {
  announcement: IAnnouncement;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(announcement.text);
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();
  const { user } = useAuth();

  const author = typeof announcement.author === 'object' ? announcement.author : null;

  const authorName = author ? `${author.firstName} ${author.lastName}` : 'Unknown';

  const authorAvatar =
    author?.photoURL ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop';

  const isAuthor =
    user?._id ===
    (typeof announcement.author === 'object' ? announcement.author._id : announcement.author);

  const handleUpdate = async () => {
    if (!editText.trim()) return;

    await updateMutation.mutateAsync({
      id: announcement._id,
      payload: { text: editText },
    });

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteMutation.mutateAsync(announcement._id);
    }
  };

  const cancelEdit = () => {
    setEditText(announcement.text);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins < 1 ? 'Just now' : `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <Card className="p-4 rounded-xl shadow-sm">
      <div className="flex gap-4 items-start">
        <div className="shrink-0 flex items-start gap-4 flex-1">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-lg">{authorName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(announcement.createdAt)}
                </p>
              </div>

              {isAuthor && !isEditing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <CardContent className="p-0 flex flex-col gap-1 mt-3">
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending || !editText.trim()}
                    >
                      {updateMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{announcement.text}</p>
              )}
            </CardContent>
          </div>
        </div>
      </div>
    </Card>
  );
}
