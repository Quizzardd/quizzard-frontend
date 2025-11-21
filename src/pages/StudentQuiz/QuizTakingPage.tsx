import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { IQuiz, IQuestion } from '@/types/quizzes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Static quiz data for testing
const STATIC_QUIZ: IQuiz = {
  _id: 'quiz1',
  title: 'React Fundamentals Quiz',
  description: 'Test your knowledge of React basics and core concepts',
  totalMarks: 10,
  durationMinutes: 30,
  startAt: new Date().toISOString(),
  endAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  questions: [
    {
      _id: 'q1',
      text: 'What is React?',
      options: [
        'A JavaScript library for building user interfaces',
        'A CSS framework',
        'A backend framework',
        'A database',
      ],
      correctOptionIndex: 0,
      points: 1,
    },
    {
      _id: 'q2',
      text: 'Which hook is used to manage state in functional components?',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctOptionIndex: 1,
      points: 1,
    },
    {
      _id: 'q3',
      text: 'What does JSX stand for?',
      options: [
        'JavaScript XML',
        'JavaScript Extension',
        'Java Syntax Extension',
        'JavaScript Extra',
      ],
      correctOptionIndex: 0,
      points: 1,
    },
    {
      _id: 'q4',
      text: 'Which method is used to update the state in React?',
      options: ['updateState()', 'setState()', 'changeState()', 'modifyState()'],
      correctOptionIndex: 1,
      points: 1,
    },
    {
      _id: 'q5',
      text: 'What is the virtual DOM?',
      options: [
        'A lightweight copy of the actual DOM',
        'A CSS framework',
        'A backend API',
        'A database',
      ],
      correctOptionIndex: 0,
      points: 1,
    },
    {
      _id: 'q6',
      text: 'Which hook is used for side effects?',
      options: ['useState', 'useEffect', 'useContext', 'useMemo'],
      correctOptionIndex: 1,
      points: 1,
    },
    {
      _id: 'q7',
      text: 'What is a React component?',
      options: ['A reusable piece of UI', 'A CSS class', 'A database table', 'A server endpoint'],
      correctOptionIndex: 0,
      points: 1,
    },
    {
      _id: 'q8',
      text: 'Which company developed React?',
      options: ['Google', 'Facebook', 'Microsoft', 'Amazon'],
      correctOptionIndex: 1,
      points: 1,
    },
    {
      _id: 'q9',
      text: 'What is the purpose of props in React?',
      options: [
        'To pass data from parent to child components',
        'To style components',
        'To manage state',
        'To make API calls',
      ],
      correctOptionIndex: 0,
      points: 1,
    },
    {
      _id: 'q10',
      text: 'What is React Router used for?',
      options: ['Navigation between pages', 'State management', 'Styling', 'API integration'],
      correctOptionIndex: 0,
      points: 1,
    },
  ],
};

export default function QuizTakingPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz] = useState<IQuiz>(STATIC_QUIZ); // TODO: Replace with API call
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quiz.durationMinutes * 60); // in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Enter fullscreen
  const enterFullscreen = useCallback(() => {
    const elem = containerRef.current;
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  // Handle fullscreen change
  const handleFullscreenChange = useCallback(() => {
    const isNowFullscreen = !!document.fullscreenElement;
    setIsFullscreen(isNowFullscreen);

    if (!isNowFullscreen && quizStarted && !quizSubmitted) {
      setWarningCount((prev) => prev + 1);
      setShowWarningDialog(true);
    }
  }, [quizStarted, quizSubmitted]);

  // Handle visibility change (tab switch)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && quizStarted && !quizSubmitted) {
      setWarningCount((prev) => prev + 1);
      setShowWarningDialog(true);
    }
  }, [quizStarted, quizSubmitted]);

  // Submit quiz
  const submitQuiz = useCallback(() => {
    if (quizSubmitted) return;

    try {
      setQuizSubmitted(true);
      exitFullscreen();

      const submission = {
        quizId: quiz._id,
        answers,
        startTime: startTimeRef.current || new Date(),
        endTime: new Date(),
        totalMarks: quiz.totalMarks,
      };

      console.log('Quiz submitted:', submission);
      toast.success('Quiz submitted successfully!');

      // TODO: Send submission to backend
      setTimeout(() => {
        navigate('/'); // Navigate to home page
      }, 2000);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
      setQuizSubmitted(false);
    }
  }, [quiz, answers, quizSubmitted, navigate, exitFullscreen]);

  // Start quiz
  const startQuiz = () => {
    setQuizStarted(true);
    startTimeRef.current = new Date();
  };

  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted, submitQuiz]);

  // Enter fullscreen when quiz starts
  useEffect(() => {
    if (quizStarted && !quizSubmitted) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        enterFullscreen();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [quizStarted, quizSubmitted, enterFullscreen]);

  // Fullscreen and visibility listeners
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleFullscreenChange, handleVisibilityChange]);

  // Auto-submit on warnings
  useEffect(() => {
    if (warningCount >= 3) {
      toast.error('Too many violations! Quiz auto-submitted.');
      submitQuiz();
    }
  }, [warningCount, submitQuiz]);

  // Prevent right-click and keyboard shortcuts
  useEffect(() => {
    const preventCheating = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+V, Ctrl+A, F12, etc.
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        toast.error('This action is not allowed during the quiz');
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    if (quizStarted && !quizSubmitted) {
      document.addEventListener('keydown', preventCheating);
      document.addEventListener('contextmenu', preventContextMenu);
    }

    return () => {
      document.removeEventListener('keydown', preventCheating);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [quizStarted, quizSubmitted]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Navigation
  const goToNext = () => {
    if (currentQuestion < (quiz.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle submit button click
  const handleSubmitClick = () => {
    exitFullscreen();
    // Small delay to ensure fullscreen exits before showing dialog
    setTimeout(() => {
      setShowSubmitDialog(true);
    }, 100);
  };

  const currentQ = quiz.questions?.[currentQuestion];

  const answeredCount = Object.keys(answers).length;
  const progress =
    (quiz.questions?.length || 0) > 0 ? (answeredCount / (quiz.questions?.length || 1)) * 100 : 0;

  // If quiz is submitted, show a simple message
  if (quizSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold">Quiz Submitted!</h2>
            <p className="text-muted-foreground">
              Your answers have been recorded successfully. Redirecting you back...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQ) return null;

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{quiz.description}</p>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{quiz.questions?.length || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{quiz.durationMinutes} min</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="text-2xl font-bold">{quiz.totalMarks}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pass Marks</p>
                <p className="text-2xl font-bold">{Math.ceil((quiz.totalMarks || 0) * 0.6)}</p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                    Important Instructions:
                  </p>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1 list-disc list-inside">
                    <li>The quiz will be in fullscreen mode</li>
                    <li>Do not exit fullscreen or switch tabs</li>
                    <li>3 violations will auto-submit your quiz</li>
                    <li>Right-click and copy/paste are disabled</li>
                    <li>Quiz auto-submits when time expires</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button onClick={startQuiz} className="w-full" size="lg">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{quiz.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {quiz.questions?.length || 0}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Warnings */}
              {warningCount > 0 && (
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">{warningCount}/3 Warnings</span>
                </div>
              )}

              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                <Clock className="h-5 w-5" />
                <span className="text-lg font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>
                {answeredCount}/{quiz.questions?.length || 0} answered
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">Question {currentQuestion + 1}</CardTitle>
                <p className="text-base leading-relaxed">{currentQ.text}</p>
              </div>
              <span className="text-sm text-muted-foreground ml-4">
                {currentQ.points || currentQ.point || 1}{' '}
                {(currentQ.points || currentQ.point || 1) === 1 ? 'mark' : 'marks'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ._id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                  answers[currentQ._id] === index
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ._id] === index
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {answers[currentQ._id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-sm mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button onClick={goToPrevious} disabled={currentQuestion === 0} variant="outline">
            Previous
          </Button>

          <div className="flex gap-2">
            {quiz.questions?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-primary text-primary-foreground'
                    : answers[quiz.questions?.[index]?._id || ''] !== undefined
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === (quiz.questions?.length || 0) - 1 ? (
            <Button onClick={handleSubmitClick}>Submit Quiz</Button>
          ) : (
            <Button onClick={goToNext}>Next</Button>
          )}
        </div>
      </div>

      {/* Warning Dialog */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Violation Detected!
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have exited fullscreen mode or switched tabs. This is violation{' '}
              <span className="font-bold text-yellow-600">{warningCount}/3</span>.
              {warningCount >= 2 && (
                <span className="block mt-2 text-red-600 font-semibold">
                  Warning: One more violation will auto-submit your quiz!
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowWarningDialog(false);
                enterFullscreen();
              }}
            >
              Return to Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {quiz.questions?.length || 0} questions.
              {answeredCount < (quiz.questions?.length || 0) && (
                <span className="block mt-2 text-yellow-600 dark:text-yellow-500 font-medium">
                  Warning: {(quiz.questions?.length || 0) - answeredCount} questions are unanswered.
                </span>
              )}
              <span className="block mt-2">
                Are you sure you want to submit? This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction onClick={submitQuiz}>Submit Quiz</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
