
import type { IModule } from './modules';
import type { IGroup } from './groups';

export interface IWeek {
  _id: string;
  title?: string;
  module: string | IModule;
  group: string | IGroup;
  order?: number;
  createdAt: Date;
}
