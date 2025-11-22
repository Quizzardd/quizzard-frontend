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
  updatedAt?: Date;
}

export interface IAnnouncementResponse {
  success: boolean;
  message: string;
  data: IAnnouncement;
}

export interface IPaginatedAnnouncementsResponse {
  success: boolean;
  message: string;
  data: {
    announcements: IAnnouncement[];
    totalPages: number;
    currentPage: number;
    totalAnnouncements: number;
  };
}
