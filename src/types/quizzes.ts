import type { IGroup } from './groups';
import type { IUser } from './users';
import type { IModule } from './modules';

export type QuizState = 'draft' | 'published' | 'closed';

export interface IQuiz {
  _id: string;
  title: string;
  description?: string;
  module?: string | IModule;
  group: string | IGroup;
  durationMinutes?: number;
  startAt?: Date;
  endAt?: Date;
  state: QuizState;
  createdBy: string | IUser;
  createdAt: Date;
}

export type QuestionType = 'MCQ' | 'SHORT';

export interface IQuestion {
  _id: string;
  quiz: string | IQuiz;
  text?: string;
  options?: string[]; // For MCQ
  correctIndex?: number; // For MCQ
  points: number;
  type: QuestionType;
  createdAt: Date;
}
