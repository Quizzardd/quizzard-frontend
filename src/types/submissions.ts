import type { IQuiz } from './quizzes';
import type { IUser } from './users';
import type { IQuestion } from './quizzes';

export interface IAnswer {
  question: string | IQuestion;
  questionText?: string; // For result display
  options?: string[]; // For result display
  point?: number; // Points for this question
  selectedIndex?: number; // For MCQ
  correctOptionIndex?: number; // For result display
  freeText?: string; // For SHORT
  isCorrect?: boolean;
  pointsAwarded?: number;
}

export interface ISubmission {
  _id: string;
  quiz: string | IQuiz;
  student: string | IUser;
  answers: IAnswer[];
  scoreTotal?: number;
  totalQuizPoints?: number; // Total points available
  startedAt: Date;
  submittedAt?: Date;
}
