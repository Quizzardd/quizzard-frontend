import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus, Trash2, FileUp, Link2, FileText } from 'lucide-react';
import { useState, useRef } from 'react';
import MaterialItem from './MaterialItem';
import QuizItem from './QuizItem';
import type { IModule } from '@/types/modules';
import { useMaterialsByModule } from '@/hooks/useMaterial';
import { useDeleteModule } from '@/hooks/useModule';
import {
  useCreateMaterial,
  useCreateMaterialByLink,
  useCreateMaterialByUrl,
} from '@/hooks/useMaterial';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModuleCardProps {
  module: IModule;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Link dialog state
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // URL dialog state
  const [urlTitle, setUrlTitle] = useState('');
  const [urlType, setUrlType] = useState<'pdf' | 'video'>('pdf');
  const [materialUrl, setMaterialUrl] = useState('');

  const groupId = typeof module.group === 'string' ? module.group : module.group._id;

  const { data: materials, isLoading: materialsLoading } = useMaterialsByModule(module._id);
  const deleteModuleMutation = useDeleteModule(groupId);
  const createMaterialMutation = useCreateMaterial(module._id);
  const createLinkMutation = useCreateMaterialByLink(module._id);
  const createUrlMutation = useCreateMaterialByUrl(module._id);

  const handleDeleteModule = () => {
    deleteModuleMutation.mutate(module._id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const handleAddMaterial = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      createMaterialMutation.mutate({ files: fileArray });
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;

    createLinkMutation.mutate(
      {
        title: linkTitle.trim() || undefined,
        url: linkUrl.trim(),
      },
      {
        onSuccess: () => {
          setShowLinkDialog(false);
          setLinkTitle('');
          setLinkUrl('');
        },
      },
    );
  };

  const handleAddUrl = () => {
    if (!materialUrl.trim()) return;

    createUrlMutation.mutate(
      {
        title: urlTitle.trim() || undefined,
        type: urlType,
        url: materialUrl.trim(),
      },
      {
        onSuccess: () => {
          setShowUrlDialog(false);
          setUrlTitle('');
          setMaterialUrl('');
          setUrlType('pdf');
        },
      },
    );
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
                className="hidden"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" size="sm" className="text-primary hover:text-primary/80">
                    <Plus className="h-4 w-4" />
                    Material
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddMaterial}>
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload File
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLinkDialog(true)}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Add Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowUrlDialog(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Add URL (PDF/Video)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
          <CardContent className="space-y-2 pt-6">
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
                No materials yet. Click "Material" to add one.
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

      {/* Add Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
            <DialogDescription>
              Add a web link as material (YouTube, Google Drive, etc.)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-title">Title (Optional)</Label>
              <Input
                id="link-title"
                placeholder="e.g., Course Introduction Video"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                type="url"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddLink}
              disabled={!linkUrl.trim() || createLinkMutation.isPending}
            >
              {createLinkMutation.isPending ? 'Adding...' : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add URL (PDF/Video) Dialog */}
      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Material by URL</DialogTitle>
            <DialogDescription>
              Add a PDF or Video file by providing its direct URL
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url-title">Title (Optional)</Label>
              <Input
                id="url-title"
                placeholder="e.g., Lecture Notes"
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url-type">Type *</Label>
              <Select value={urlType} onValueChange={(value: 'pdf' | 'video') => setUrlType(value)}>
                <SelectTrigger id="url-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material-url">URL *</Label>
              <Input
                id="material-url"
                placeholder="https://example.com/file.pdf"
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
                type="url"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUrlDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUrl}
              disabled={!materialUrl.trim() || createUrlMutation.isPending}
            >
              {createUrlMutation.isPending ? 'Adding...' : 'Add Material'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
