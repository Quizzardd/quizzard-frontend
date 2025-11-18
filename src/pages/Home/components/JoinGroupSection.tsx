import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JoinGroupModal from './JoinGroupModal';

export default function JoinGroupSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Join a Group</h2>
            <p className="text-sm text-muted-foreground">
              Have an invite code? Join a group to access courses and materials.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Join with Code
          </Button>
        </div>
      </div>

      <JoinGroupModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
