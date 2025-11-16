
import type { IGroup } from './groups';
import type { IUser } from './users';
import type { IQuiz } from './quizzes';

export interface IAnnouncement {
  _id: string;
  group: string | IGroup;
  author: string | IUser;
  text: string;
  quiz?: string | IQuiz; // Optional, for announcements related to quizzes
  createdAt: Date;
}

