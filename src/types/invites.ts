
import type { IGroup } from './groups';
import type { IUser } from './users';

export interface IInvite {
  _id: string;
  group: string | IGroup;
  code: string;
  expiresAt?: Date;
  createdBy?: string | IUser;
}
