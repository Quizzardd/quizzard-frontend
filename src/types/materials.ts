import { Types } from 'mongoose';
import type { IWeek } from './weeks';
import type { IGroup } from './groups';

export type MaterialType = 'pdf' | 'video' | 'link';

export interface IMaterial {
  _id: Types.ObjectId;
  title?: string;
  type: MaterialType;
  week?: Types.ObjectId | IWeek;
  group: Types.ObjectId | IGroup;
  url?: string;
  createdAt: Date;
}
