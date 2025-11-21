import { FileQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IQuiz } from '@/types/quizzes';

interface QuizItemProps {
  quiz: IQuiz;
}

export default function QuizItem({ quiz }: QuizItemProps) {
  const getStatusColor = (state: string) => {
    switch (state) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="flex items-center gap-3 py-3 px-3 rounded-md bg-accent/30 border border-border hover:border-primary/50 transition-colors cursor-pointer group">
      <FileQuestion className="h-5 w-5 text-primary" />
      <div className="flex-1">
        <p className="text-sm font-medium group-hover:text-primary transition-colors">
          {quiz.title}
        </p>
      </div>
      <Badge className={getStatusColor(quiz.state)}>{quiz.state}</Badge>
      {quiz.state === 'published' && (
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Take
        </Button>
      )}
    </div>
  );
}
