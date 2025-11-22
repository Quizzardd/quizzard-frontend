import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, Award } from 'lucide-react';
import { getQuizResult } from '@/services/quizService';
import type { ISubmission } from '@/types/submissions';
import { toast } from 'react-hot-toast';

interface QuizResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  quizTitle: string;
}

export default function QuizResultModal({
  open,
  onOpenChange,
  quizId,
  quizTitle,
}: QuizResultModalProps) {
  const [submission, setSubmission] = useState<ISubmission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getQuizResult(quizId);
      setSubmission(result);
    } catch (err) {
      console.error('Failed to fetch quiz result:', err);
      const errorMessage = 'Failed to load quiz result. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && quizId) {
      fetchResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, quizId]);

  const calculatePercentage = () => {
    if (!submission || !submission.totalQuizPoints) return 0;
    return Math.round((submission.scoreTotal / submission.totalQuizPoints) * 100);
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Quiz Results</DialogTitle>
          <DialogDescription>{quizTitle}</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-destructive">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && submission && (
          <div className="space-y-6">
            {/* Score Summary */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Award className="h-12 w-12 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Your Score</p>
                      <p className="text-4xl font-bold">
                        {submission.scoreTotal} / {submission.totalQuizPoints}
                      </p>
                      <p className="text-lg text-muted-foreground">{calculatePercentage()}%</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Started:</strong> {formatDate(submission.startedAt)}
                    </p>
                    <p>
                      <strong>Submitted:</strong> {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions and Answers */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detailed Results</h3>
              {submission.answers?.map((answer, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    answer.isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-semibold">Question {index + 1}</span>
                          <Badge variant={answer.isCorrect ? 'default' : 'destructive'}>
                            {answer.isCorrect ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {answer.isCorrect ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </div>

                        <p className="text-base mb-4">{answer.questionText}</p>

                        {answer.options && answer.options.length > 0 && (
                          <div className="space-y-2">
                            {answer.options.map((option, optIndex) => {
                              const isSelected = answer.selectedIndex === optIndex;
                              const isCorrect = answer.correctOptionIndex === optIndex;

                              return (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-lg border ${
                                    isSelected && isCorrect
                                      ? 'bg-green-50 border-green-500 text-green-900'
                                      : isSelected && !isCorrect
                                        ? 'bg-red-50 border-red-500 text-red-900'
                                        : isCorrect
                                          ? 'bg-green-50 border-green-300 text-green-800'
                                          : 'bg-muted/50 border-border'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    <span>{option}</span>
                                    {isSelected && !isCorrect && (
                                      <XCircle className="h-4 w-4 ml-auto text-red-600" />
                                    )}
                                    {isCorrect && (
                                      <CheckCircle2 className="h-4 w-4 ml-auto text-green-600" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {answer.selectedIndex === -1 && (
                          <p className="text-sm text-muted-foreground italic">
                            You did not answer this question
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Points</p>
                        <p className="text-xl font-bold">
                          {answer.isCorrect ? answer.point : 0} / {answer.point}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
