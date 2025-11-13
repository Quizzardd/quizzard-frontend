import type { IUser } from './users';


export interface IGroup {
  _id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  owner: string | IUser;
  createdAt: Date;
}

export type GroupMemberRole = 'teacher' | 'student';

export interface IGroupMember {
  _id: string;
  group: string | IGroup;
  user: string | IUser;
  role: GroupMemberRole;
  joinedAt: Date;
}
