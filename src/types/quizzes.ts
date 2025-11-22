import type { IGroup } from './groups';
import type { IUser } from './users';
import type { IModule } from './modules';

export type QuizState = 'draft' | 'published' | 'closed';

export interface IQuiz {
  _id: string;
  title: string;
  description?: string;
  week?: string | IWeek;
  group?: string | IGroup;
  questions?: IQuestion[]; // Populated questions for quiz taking
  totalMarks?: number;
  durationMinutes?: number;
  startAt?: Date | string;
  endAt?: Date | string;
  state?: QuizState;
  createdBy?: string | IUser;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type QuestionType = 'MCQ' | 'SHORT';

export interface IQuestion {
  _id: string;
  quiz?: string | IQuiz;
  text: string;
  options?: string[]; // For MCQ
  correctIndex?: number; // For MCQ (renamed from correctOptionIndex for consistency)
  correctOptionIndex?: number; // Alternative name from backend
  point: number; // Backend uses 'point' not 'points'
  points?: number; // Compatibility field
  type?: QuestionType;
  createdAt?: Date;
}

export interface IQuizSubmission {
  quizId: string;
  answers: Record<string, number>; // questionId -> selected option index
  startTime: Date;
  endTime: Date;
  totalMarks: number;
  obtainedMarks?: number;
}
