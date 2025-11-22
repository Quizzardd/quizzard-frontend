import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { AIQuizGenerationModal } from './AIQuizGenerationModal';
import { useModulesByGroup } from '@/hooks/useModule';
import { useAuth } from '@/hooks/useAuth';
import type { IModule } from '@/types';

interface CreateQuizButtonProps {
  groupId: string;
}

export default function CreateQuizButton({ groupId }: CreateQuizButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-chart-2 hover:bg-chart-2/90 text-primary-foreground"
      >
        <Sparkles />
        Create Quiz with AI
      </Button>

      <AIQuizGenerationModal open={isModalOpen} onOpenChange={setIsModalOpen} groupId={groupId} />
    </>
  );
}
