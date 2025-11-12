import type { IUser } from './users';
import { Types } from 'mongoose';


export interface IGroup {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  coverUrl?: string;
  owner: Types.ObjectId | IUser;
  createdAt: Date;
}

export type GroupMemberRole = 'teacher' | 'student';

export interface IGroupMember {
  _id: Types.ObjectId;
  group: Types.ObjectId | IGroup;
  user: Types.ObjectId | IUser;
  role: GroupMemberRole;
  joinedAt: Date;
}
