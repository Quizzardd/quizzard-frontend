import { Types } from 'mongoose';
import type { IGroup } from './groups';
import type { IUser } from './users';
import type { IQuiz } from './quizzes';

export interface IAnnouncement {
  _id: Types.ObjectId;
  group: Types.ObjectId | IGroup;
  author: Types.ObjectId | IUser;
  text: string;
  quiz?: Types.ObjectId | IQuiz; // Optional, for announcements related to quizzes
  createdAt: Date;
}

