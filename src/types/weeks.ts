import { Types } from 'mongoose';
import type { IModule } from './modules';
import type { IGroup } from './groups';

export interface IWeek {
  _id: Types.ObjectId;
  title?: string;
  module: Types.ObjectId | IModule;
  group: Types.ObjectId | IGroup;
  order?: number;
  createdAt: Date;
}
