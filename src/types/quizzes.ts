import type { Types } from 'mongoose';
import type { IWeek } from './weeks';
import type { IGroup } from './groups';
import type { IUser } from './users';

export type QuizState = 'draft' | 'published' | 'closed';

export interface IQuiz {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  week?: Types.ObjectId | IWeek;
  group: Types.ObjectId | IGroup;
  durationMinutes?: number;
  startAt?: Date;
  endAt?: Date;
  state: QuizState;
  createdBy: Types.ObjectId | IUser;
  createdAt: Date;
}

export type QuestionType = 'MCQ' | 'SHORT';

export interface IQuestion {
  _id: Types.ObjectId;
  quiz: Types.ObjectId | IQuiz;
  text?: string;
  options?: string[]; // For MCQ
  correctIndex?: number; // For MCQ
  points: number;
  type: QuestionType;
  createdAt: Date;
}
