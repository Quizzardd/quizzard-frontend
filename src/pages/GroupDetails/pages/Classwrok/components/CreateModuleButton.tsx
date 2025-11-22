import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
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
import { useCreateModule } from '@/hooks/useModule';

interface CreateModuleButtonProps {
  groupId: string;
}

export default function CreateModuleButton({ groupId }: CreateModuleButtonProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const createModuleMutation = useCreateModule(groupId);

  const handleCreateModule = () => {
    if (!title.trim()) return;

    createModuleMutation.mutate(
      { title: title.trim() },
      {
        onSuccess: () => {
          setTitle('');
          setOpen(false);
        },
      },
    );
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus />
        Add Module
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
            <DialogDescription>
              Add a new module to organize your course materials and quizzes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="module-title">Module Title</Label>
              <Input
                id="module-title"
                placeholder="e.g., Introduction to React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !createModuleMutation.isPending) {
                    handleCreateModule();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateModule}
              disabled={!title.trim() || createModuleMutation.isPending}
            >
              {createModuleMutation.isPending ? 'Creating...' : 'Create Module'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
