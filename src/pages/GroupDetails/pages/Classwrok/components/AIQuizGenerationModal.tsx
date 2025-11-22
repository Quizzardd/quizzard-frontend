import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Loader2 } from 'lucide-react';
import { useModulesByGroup } from '@/hooks/useModule';

interface AIQuizGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
}

export function AIQuizGenerationModal({ open, onOpenChange, groupId }: AIQuizGenerationModalProps) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedModules, setSelectedModules] = useState<Array<{ id: string; title: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: modules, isLoading, error } = useModulesByGroup(groupId!);

  //   const handleModuleToggle = (moduleId: string) => {
  //     setSelectedModules((prev) =>
  //       prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId],
  //     );
  //   };
  const handleModuleToggle = (moduleId: string) => {
    const module = modules?.find((mod) => mod._id === moduleId);
    if (!module) return;
    setSelectedModules((prev) => {
      const isSelected = prev.some((mod) => mod.id === moduleId);
      if (isSelected) {
        return prev.filter((mod) => mod.id !== moduleId);
      } else {
        return [...prev, { id: module._id, title: module.title }];
      }
    });
  };
  const handleGenerate = () => {
    if (!message.trim() || selectedModules?.length === 0) return;

    setIsGenerating(true);

    // Navigate immediately to quiz creation page with chat open
    setTimeout(() => {
      navigate(`/groups/${groupId}/create-quiz`, {
        state: {
          message,
          selectedModules,
          groupId,
        },
      });
      setIsGenerating(false);
      onOpenChange(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Quiz with AI
          </DialogTitle>
          <DialogDescription>
            Describe the quiz you want to create and select the modules to include
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Quiz Description / Message</Label>
            <Textarea
              id="message"
              placeholder="E.g., Create a 10-question quiz about JavaScript basics covering variables, functions, and loops..."
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Modules</Label>
            <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto space-y-3">
              {modules?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No modules available. Create a module first.
                </p>
              ) : (
                modules?.map((module) => (
                  <div key={module._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={module._id}
                      checked={selectedModules?.some((mod) => mod.id === module._id)}
                      onCheckedChange={() => handleModuleToggle(module._id)}
                    />
                    <label
                      htmlFor={module._id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {module.title}
                    </label>
                  </div>
                ))
              )}
            </div>
            {selectedModules?.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedModules?.length} module{selectedModules?.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!message.trim() || selectedModules?.length === 0 || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
