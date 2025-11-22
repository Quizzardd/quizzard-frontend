import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateAnnouncement } from '@/hooks/useAnnouncement';

interface CreateAnnouncementButtonProps {
  groupId: string;
}

export default function CreateAnnouncementButton({ groupId }: CreateAnnouncementButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const createMutation = useCreateAnnouncement();

  const handlePostAnnouncement = async () => {
    if (!content.trim()) return;

    await createMutation.mutateAsync({
      text: content,
      group: groupId,
    });

    setContent('');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setContent('');
    setIsOpen(false);
  };

  return (
    <div className="w-full mb-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              w-full px-6 py-4 
              flex items-center gap-3
              border-2 border-dashed rounded-lg
              transition-all duration-200
              ${
                isHovered
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
              }
            `}
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span className="text-base font-medium">Create Announcement</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something with your class..."
              className="w-full min-h-[200px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-start gap-3 mt-4">
            <Button onClick={handleCancel} variant="outline" className="px-6">
              Cancel
            </Button>
            <Button
              onClick={handlePostAnnouncement}
              className="px-6 bg-blue-600 hover:bg-blue-700"
              disabled={!content.trim() || createMutation.isPending}
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Announcement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
