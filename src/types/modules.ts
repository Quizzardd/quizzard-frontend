import type { IGroup } from './groups';

export interface IModule {
  _id: string;
  title: string;
  group: string | IGroup;
  material?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
