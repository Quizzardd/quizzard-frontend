
import type { IAnnouncement } from './announcements';
import type { IUser } from './users';

export interface IComment {
  _id: string;
  announcement: string | IAnnouncement;
  author: string | IUser;
  text: string;
  parentComment?: string | IComment | null; // For replies
  createdAt: Date;
}
