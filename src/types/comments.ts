import { Types } from 'mongoose';
import type { IAnnouncement } from './announcements';
import type { IUser } from './users';

export interface IComment {
  _id: Types.ObjectId;
  announcement: Types.ObjectId | IAnnouncement;
  author: Types.ObjectId | IUser;
  text: string;
  parentComment?: Types.ObjectId | IComment | null; // For replies
  createdAt: Date;
}
