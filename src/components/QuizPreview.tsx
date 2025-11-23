import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Loader2,
  FileQuestion,
  AlertCircle,
  Edit,
  Save,
  X,
  Trash2,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/config/axiosConfig';
import toast from 'react-hot-toast';

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
  groupId?: string;
  selectedModules?: Array<{ id: string; title: string }>;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({
  quiz,
  isLoading,
  error,
  quizAction,
  groupId,
  selectedModules = [],
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedQuiz, setEditedQuiz] = useState<Partial<Quiz>>({});
  const [editedQuestions, setEditedQuestions] = useState<QuizQuestion[]>([]);
  const queryClient = useQueryClient();

  // Update quiz mutation
  const updateQuizMutation = useMutation({
    mutationFn: async (quizData: any) => {
      // Use the from-details endpoint to update with full question objects
      const payload = {
        quiz_details: quizData
      };
      console.log('📤 Full request payload:', JSON.stringify(payload, null, 2));
      const response = await axios.put(`/quizzes/from-details/${quiz?._id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quiz?._id] });
      toast.success('Quiz updated successfully!');
      setIsEditMode(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update quiz');
    },
  });

  // Announce quiz mutation
  const announceQuizMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/announcements', {
        text: `New quiz "${quiz?.title}" is now available!`,
        quiz: quiz?._id,
        group: groupId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Quiz announced successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to announce quiz');
    },
  });

  const handleEdit = () => {
    setEditedQuiz({
      title: quiz?.title,
      description: quiz?.description,
      durationMinutes: quiz?.durationMinutes,
      totalMarks: quiz?.totalMarks,
      startAt: quiz?.startAt,
      endAt: quiz?.endAt,
    });
    // Ensure all questions have correctOptionIndex (default to 0 if null/undefined)
    const questions = (quiz?.questions || []).map(q => ({
      ...q,
      correctOptionIndex: (q.correctOptionIndex !== null && q.correctOptionIndex !== undefined) ? q.correctOptionIndex : 0
    }));
    console.log('📝 Initialized questions with correctOptionIndex:', questions);
    setEditedQuestions(questions);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedQuiz({});
    setEditedQuestions([]);
  };

  const handleUpdateAndAnnounce = async () => {
    try {
      // Ensure dates are in ISO format
      const startAt = editedQuiz.startAt || quiz?.startAt;
      const endAt = editedQuiz.endAt || quiz?.endAt;
      
      // Convert to ISO string if they're Date objects
      const startAtISO = startAt ? (typeof startAt === 'string' ? startAt : new Date(startAt).toISOString()) : new Date().toISOString();
      const endAtISO = endAt ? (typeof endAt === 'string' ? endAt : new Date(endAt).toISOString()) : new Date(Date.now() + 3600000).toISOString();
      
      // Prepare quiz data with updated questions in the format expected by updateQuizFromDetails
      const quizData = {
        title: editedQuiz.title || quiz?.title || '',
        description: editedQuiz.description !== undefined ? editedQuiz.description : (quiz?.description || ''),
        totalMarks: Number(editedQuiz.totalMarks || quiz?.totalMarks || 0),
        durationMinutes: Number(editedQuiz.durationMinutes || quiz?.durationMinutes || 60),
        startAt: startAtISO,
        endAt: endAtISO,
        questions: editedQuestions.map(q => ({
          text: q.text,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex !== null && q.correctOptionIndex !== undefined ? Number(q.correctOptionIndex) : 0,
          point: Number(q.point)
        })),
        module_ids: selectedModules.map(m => m.id) // Use module IDs from props
      };
      
      console.log('📤 Sending quiz update:', quizData);
      
      // First update the quiz
      await updateQuizMutation.mutateAsync(quizData);
      // Then announce it
      await announceQuizMutation.mutateAsync();
    } catch (error) {
      console.error('❌ Update failed:', error);
      // Errors are handled by individual mutations
    }
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...editedQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setEditedQuestions(updated);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...editedQuestions];
    updated[questionIndex].options[optionIndex] = value;
    setEditedQuestions(updated);
  };

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      _id: `temp-${Date.now()}`,
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      point: 1,
    };
    setEditedQuestions([...editedQuestions, newQuestion]);
  };

  const handleDeleteQuestion = (index: number) => {
    setEditedQuestions(editedQuestions.filter((_, i) => i !== index));
  };
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
          <div className="flex-1 space-y-3">
            {isEditMode ? (
              /* Edit Mode */
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={editedQuiz.title || ''}
                    onChange={(e) => setEditedQuiz({ ...editedQuiz, title: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editedQuiz.description || ''}
                    onChange={(e) => setEditedQuiz({ ...editedQuiz, description: e.target.value })}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={editedQuiz.durationMinutes || ''}
                      onChange={(e) => setEditedQuiz({ ...editedQuiz, durationMinutes: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marks">Total Marks</Label>
                    <Input
                      id="marks"
                      type="number"
                      value={editedQuiz.totalMarks || ''}
                      onChange={(e) => setEditedQuiz({ ...editedQuiz, totalMarks: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="startAt">Start Date & Time</Label>
                    <Input
                      id="startAt"
                      type="datetime-local"
                      value={editedQuiz.startAt ? new Date(editedQuiz.startAt).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditedQuiz({ ...editedQuiz, startAt: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endAt">End Date & Time</Label>
                    <Input
                      id="endAt"
                      type="datetime-local"
                      value={editedQuiz.endAt ? new Date(editedQuiz.endAt).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditedQuiz({ ...editedQuiz, endAt: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdateAndAnnounce}
                    disabled={updateQuizMutation.isPending || announceQuizMutation.isPending}
                    className="flex-1"
                  >
                    {updateQuizMutation.isPending || announceQuizMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update & Announce
                      </>
                    )}
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <Button onClick={handleEdit} size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                )}
                {/* Quiz Info */}
                <div className="grid grid-cols-2 gap-3">
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
              </>
            )}
          </div>
          {!isEditMode && quizAction && (
            <Badge variant={quizAction === 'created' ? 'default' : 'secondary'} className="shrink-0">
              {quizAction === 'created' ? 'New' : 'Updated'}
            </Badge>
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
                Questions ({isEditMode ? editedQuestions.length : quiz.questions.length})
              </h3>
              {isEditMode && (
                <Button onClick={handleAddQuestion} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              )}
            </div>

            {(isEditMode ? editedQuestions : quiz.questions).map((question, index) => (
              <Card key={question._id} className="border-muted">
                <CardContent className="pt-4">
                  {isEditMode ? (
                    /* Edit Mode for Question */
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">
                          Q{index + 1}
                        </Badge>
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label htmlFor={`question-${index}`}>Question Text</Label>
                            <Textarea
                              id={`question-${index}`}
                              value={question.text}
                              onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                              className="mt-1"
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`points-${index}`}>Points</Label>
                              <Input
                                id={`points-${index}`}
                                type="number"
                                value={question.point}
                                onChange={(e) => handleQuestionChange(index, 'point', Number(e.target.value))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`correct-${index}`}>Correct Answer</Label>
                              <select
                                id={`correct-${index}`}
                                value={question.correctOptionIndex}
                                onChange={(e) => handleQuestionChange(index, 'correctOptionIndex', Number(e.target.value))}
                                className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                {question.options.map((_, optIdx) => (
                                  <option key={optIdx} value={optIdx}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <Label>Options</Label>
                            <div className="space-y-2 mt-1">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <span className="font-medium text-sm shrink-0 w-6">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  <Input
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteQuestion(index)}
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode for Question */
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
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
