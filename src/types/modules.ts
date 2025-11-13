import type { IGroup } from './groups';


export interface IModule {
  _id: string;
  title: string;
  group: string | IGroup;
  order?: number;
  createdAt: Date;
}
