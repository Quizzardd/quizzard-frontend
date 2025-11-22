import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  MoreVertical,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncement';
import { useAuth } from '@/hooks/useAuth';
import { useGroupContext } from '../../../contexts/GroupContext';
import { useCheckQuizTaken } from '@/hooks/useQuiz';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { IAnnouncement } from '@/types/announcements';
import type { IQuiz } from '@/types/quizzes';
import QuizResultModal from './QuizResultModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface AnnouncementCardProps {
  announcement: IAnnouncement;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const { isTeacher } = useGroupContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(announcement.text);
  const [showResultModal, setShowResultModal] = useState(false);
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();
  const { user } = useAuth();

  const quiz = typeof announcement.quiz === 'object' ? announcement.quiz : null;
  const quizId = typeof announcement.quiz === 'string' ? announcement.quiz : quiz?._id;

  // Check if student has taken the quiz
  const { data: quizTakenData } = useCheckQuizTaken(user?._id || '', quizId || '');
  const isTaken = quizTakenData?.data?.isTaken || false;

  const author = typeof announcement.author === 'object' ? announcement.author : null;

  const authorName = author ? `${author.firstName} ${author.lastName}` : 'Unknown';

  const authorAvatar =
    author?.photoURL ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop';

  const isAuthor =
    user?._id ===
    (typeof announcement.author === 'object' ? announcement.author._id : announcement.author);

  const canEdit = isTeacher && isAuthor;

  const handleUpdate = async () => {
    if (!editText.trim()) return;

    await updateMutation.mutateAsync({
      id: announcement._id,
      payload: { text: editText },
    });

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteMutation.mutateAsync(announcement._id);
    }
  };

  const cancelEdit = () => {
    setEditText(announcement.text);
    setIsEditing(false);
  };

  const getQuizStatus = (quiz: IQuiz) => {
    if (!quiz.startAt || !quiz.endAt) return null;

    const now = new Date();
    const start = new Date(quiz.startAt);
    const end = new Date(quiz.endAt);

    if (now < start) {
      return { type: 'upcoming', message: `Quiz starts ${start.toLocaleString()}`, color: 'blue' };
    } else if (now > end) {
      return { type: 'ended', message: 'Quiz deadline has ended', color: 'gray' };
    } else {
      return {
        type: 'active',
        message: 'Quiz is available now - you can take it!',
        color: 'green',
      };
    }
  };

  const handleTakeQuiz = () => {
    if (quizId && user?._id) {
      // Invalidate the query before navigating to ensure fresh data on return
      queryClient.invalidateQueries({ queryKey: ['quiz-taken', user._id, quizId] });
      navigate(`/quizzes/${quizId}/take`);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins < 1 ? 'Just now' : `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <Card className="p-4 rounded-xl shadow-sm">
      <div className="flex gap-4 items-start">
        <div className="shrink-0 flex items-start gap-4 flex-1">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-lg">{authorName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(announcement.createdAt)}
                </p>
              </div>

              {canEdit && !isEditing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <CardContent className="p-0 flex flex-col gap-1 mt-3">
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending || !editText.trim()}
                    >
                      {updateMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{announcement.text}</p>
              )}
            </CardContent>

            {/* Quiz Section */}
            {quiz && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-base">{quiz.title}</h4>
                      {isTaken && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>

                    {quiz.description && (
                      <p className="text-sm text-muted-foreground mb-3">{quiz.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      {quiz.totalMarks && (
                        <span className="flex items-center gap-1">
                          <strong>Total Marks:</strong> {quiz.totalMarks}
                        </span>
                      )}
                      {quiz.durationMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <strong>Duration:</strong> {quiz.durationMinutes} minutes
                        </span>
                      )}
                    </div>

                    {quiz.startAt && quiz.endAt && (
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <strong>Start:</strong> {new Date(quiz.startAt).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <strong>End:</strong> {new Date(quiz.endAt).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {(() => {
                      const status = getQuizStatus(quiz);
                      if (status) {
                        return (
                          <div
                            className={`mt-3 flex items-center gap-2 text-sm ${
                              status.type === 'active'
                                ? 'text-green-600'
                                : status.type === 'ended'
                                  ? 'text-gray-500'
                                  : 'text-blue-600'
                            }`}
                          >
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">{status.message}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  {!isTeacher && (
                    <div className="flex flex-col gap-2">
                      {(() => {
                        const status = getQuizStatus(quiz);
                        const isActive = status?.type === 'active';
                        const isEnded = status?.type === 'ended';

                        if (isTaken) {
                          return (
                            <Button
                              onClick={() => setShowResultModal(true)}
                              size="sm"
                              variant="outline"
                              className="border-green-500 text-green-700 hover:bg-green-50"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Results
                            </Button>
                          );
                        }

                        return (
                          <Button
                            onClick={handleTakeQuiz}
                            disabled={!isActive || isEnded}
                            size="sm"
                            className={
                              isEnded ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''
                            }
                          >
                            {isEnded ? 'Quiz Ended' : 'Take Quiz'}
                          </Button>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Result Modal */}
      {quiz && (
        <QuizResultModal
          quizId={quiz._id}
          quizTitle={quiz.title}
          open={showResultModal}
          onOpenChange={setShowResultModal}
        />
      )}
    </Card>
  );
}
