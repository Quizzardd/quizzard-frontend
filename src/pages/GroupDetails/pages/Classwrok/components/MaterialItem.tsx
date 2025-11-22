import { FileText, Video, MoreVertical, Trash2, ExternalLink, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { IMaterial } from '@/types/materials';
import { useGroupContext } from '../../../contexts/GroupContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDeleteMaterial } from '@/hooks/useMaterial';
import { useState } from 'react';
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

interface MaterialItemProps {
  material: IMaterial;
  moduleId: string;
}

export default function MaterialItem({ material, moduleId }: MaterialItemProps) {
  const { isTeacher } = useGroupContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMaterialMutation = useDeleteMaterial(moduleId);

  const getIcon = () => {
    const type = material.type?.toLowerCase() || '';

    // Link type
    if (type === 'link') {
      return <Link2 className="h-5 w-5 text-muted-foreground" />;
    }

    // Video file types
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'video'].includes(type)) {
      return <Video className="h-5 w-5 text-muted-foreground" />;
    }

    // Document file types
    if (['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'].includes(type)) {
      return <FileText className="h-5 w-5 text-muted-foreground" />;
    }

    // Default to file icon
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  const getTypeLabel = () => {
    return material.type.toUpperCase();
  };

  const handleDelete = () => {
    deleteMaterialMutation.mutate(material._id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const handleView = () => {
    if (material.url) {
      window.open(material.url, '_blank');
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent/50 transition-colors group">
        {getIcon()}
        <div className="flex-1 cursor-pointer" onClick={handleView}>
          <p className="text-sm font-medium group-hover:text-primary transition-colors">
            {material.title || 'Untitled Material'}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {getTypeLabel()}
        </Badge>

        {isTeacher && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View/Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{material.title || 'this material'}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMaterialMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
