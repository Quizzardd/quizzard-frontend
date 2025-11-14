
import type { IWeek } from './weeks';
import type { IGroup } from './groups';

export type MaterialType = 'pdf' | 'video' | 'link';

export interface IMaterial {
  _id: string;
  title?: string;
  type: MaterialType;
  week?: string | IWeek;
  group: string | IGroup;
  url?: string;
  createdAt: Date;
}
