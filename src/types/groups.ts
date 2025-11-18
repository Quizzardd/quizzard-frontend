import type { IUser } from './users';

// Partial user info returned when owner is populated
export interface IGroupOwner {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface IGroup {
  _id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  owner: IGroupOwner;
  inviteCode?: string;
  inviteExpiredAt?: Date;
  isArchived?: boolean;
  membersCount?: number;
  modulesCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type GroupMemberRole = 'teacher' | 'student';

export interface IGroupMember {
  _id: string;
  group: IGroup;
  user: string | IUser;
  role: GroupMemberRole;
  joinedAt: string;
  __v?: number;
}
