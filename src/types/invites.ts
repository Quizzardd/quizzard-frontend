import { Types } from 'mongoose';
import type { IGroup } from './groups';
import type { IUser } from './users';

export interface IInvite {
  _id: Types.ObjectId;
  group: Types.ObjectId | IGroup;
  code: string;
  expiresAt?: Date;
  createdBy?: Types.ObjectId | IUser;
}
