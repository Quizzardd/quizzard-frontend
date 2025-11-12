import { Types } from 'mongoose';
import type { IQuiz } from './quizzes';
import type { IUser } from './users';
import type { IQuestion } from './quizzes';

export interface IAnswer {
  question: Types.ObjectId | IQuestion;
  selectedIndex?: number; // For MCQ
  freeText?: string; // For SHORT
  isCorrect?: boolean;
  pointsAwarded?: number;
}

export interface ISubmission {
  _id: Types.ObjectId;
  quiz: Types.ObjectId | IQuiz;
  student: Types.ObjectId | IUser;
  answers: IAnswer[];
  scoreTotal?: number;
  startedAt: Date;
  submittedAt?: Date;
}
