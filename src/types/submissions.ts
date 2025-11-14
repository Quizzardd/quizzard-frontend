
import type { IQuiz } from './quizzes';
import type { IUser } from './users';
import type { IQuestion } from './quizzes';

export interface IAnswer {
  question: string | IQuestion;
  selectedIndex?: number; // For MCQ
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
  startedAt: Date;
  submittedAt?: Date;
}
