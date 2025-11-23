import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Loader2,
  FileQuestion,
  AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';

interface QuizQuestion {
  _id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  point: number;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  totalMarks: number;
  durationMinutes: number;
  startAt?: string;
  endAt?: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

interface QuizPreviewProps {
  quiz: Quiz | undefined;
  isLoading: boolean;
  error: Error | null;
  quizAction?: 'created' | 'updated' | null;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({
  quiz,
  isLoading,
  error,
  quizAction,
}) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full py-12">
          <div className="text-center space-y-3">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Loading quiz...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full py-12">
          <div className="text-center space-y-3">
            <AlertCircle className="h-10 w-10 mx-auto text-destructive" />
            <p className="text-sm text-destructive">Failed to load quiz</p>
            <p className="text-xs text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full py-12">
          <div className="text-center space-y-3">
            <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            <div>
              <p className="text-sm font-medium">No Quiz Yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                The AI assistant will generate a quiz based on your conversation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-xl">{quiz.title}</CardTitle>
            {quiz.description && (
              <p className="text-sm text-muted-foreground">{quiz.description}</p>
            )}
          </div>
          {quizAction && (
            <Badge variant={quizAction === 'created' ? 'default' : 'secondary'} className="shrink-0">
              {quizAction === 'created' ? 'New' : 'Updated'}
            </Badge>
          )}
        </div>

        {/* Quiz Info */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{quiz.durationMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span>{quiz.totalMarks} marks</span>
          </div>
          {quiz.startAt && (
            <div className="flex items-center gap-2 text-sm col-span-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">
                {format(new Date(quiz.startAt), 'MMM dd, yyyy HH:mm')}
                {quiz.endAt && ` - ${format(new Date(quiz.endAt), 'HH:mm')}`}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator />

      {/* Questions List */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Questions ({quiz.questions.length})
              </h3>
            </div>

            {quiz.questions.map((question, index) => (
              <Card key={question._id} className="border-muted">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Question Header */}
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="shrink-0">
                        Q{index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-relaxed">
                          {question.text}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {question.point} {question.point === 1 ? 'mark' : 'marks'}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pl-16">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-start gap-2 text-sm p-2 rounded ${
                            optionIndex === question.correctOptionIndex
                              ? 'bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-100'
                              : 'bg-muted/50'
                          }`}
                        >
                          {optionIndex === question.correctOptionIndex && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                          )}
                          <span className="font-medium shrink-0">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span className="flex-1">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
