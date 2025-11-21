import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CreateQuizButton() {
  const handleCreateQuiz = () => {
    // TODO: Implement quiz creation logic
    console.log('Creating new quiz...');
  };

  return (
    <Button
      onClick={handleCreateQuiz}
      className="bg-chart-2 hover:bg-chart-2/90 text-primary-foreground"
    >
      <Plus />
      Create Quiz
    </Button>
  );
}
