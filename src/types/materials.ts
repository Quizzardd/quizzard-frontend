import type { IModule } from './modules';

export interface IMaterial {
  _id: string;
  title?: string;
  type: 'pdf' | 'video' | 'link' | string; // Backend enum or file extension from MIME type
  url?: string;
  fullName?: string;
  module: string | IModule;
  createdAt?: Date;
  updatedAt?: Date;
}
