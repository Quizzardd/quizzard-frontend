import type { IGroup } from './groups';
import { Types } from 'mongoose';

export interface IModule {
  _id: Types.ObjectId;
  title: string;
  group: Types.ObjectId | IGroup;
  order?: number;
  createdAt: Date;
}
