import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2, FileUp } from 'lucide-react';
import { useState, useRef } from 'react';
import MaterialItem from './MaterialItem';
import type { IModule } from '@/types/modules';
import { useMaterialsByModule } from '@/hooks/useMaterial';
import { useDeleteModule } from '@/hooks/useModule';
import { useCreateMaterial } from '@/hooks/useMaterial';
import { Skeleton } from '@/components/ui/skeleton';
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

interface ModuleCardProps {
  module: IModule;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const groupId = typeof module.group === 'string' ? module.group : module.group._id;

  const { data: materials, isLoading: materialsLoading } = useMaterialsByModule(module._id);
  const deleteModuleMutation = useDeleteModule(groupId);
  const createMaterialMutation = useCreateMaterial(module._id);
  const isUploading = createMaterialMutation.isPending;

  const handleDeleteModule = () => {
    deleteModuleMutation.mutate(module._id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const handleAddMaterial = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isUploading) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      createMaterialMutation.mutate(
        { files: fileArray },
        {
          onSettled: () => {
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          },
        },
      );
    }
  };

  return (
    <>
      <Card className="border border-border">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </Button>
              <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov"
                disabled={isUploading}
                className="hidden"
              />

              <Button
                variant="link"
                size="sm"
                className="text-primary hover:text-primary/80"
                onClick={handleAddMaterial}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload Material
                  </>
                )}
              </Button>

              <Button variant="link" size="sm" className="text-primary hover:text-primary/80">
                <Plus className="h-4 w-4" />
                Quiz
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                disabled={deleteModuleMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-2">
            {materialsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : materials && materials.length > 0 ? (
              materials.map((material) => (
                <MaterialItem key={material._id} material={material} moduleId={module._id} />
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No materials yet. Click "Upload Material" to add one.
              </div>
            )}

            {/* TODO: Add Quiz items when quiz API is integrated */}
          </CardContent>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{module.title}"? This action cannot be undone and
              will remove all materials and quizzes in this module.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModule}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
