import { Types } from 'mongoose';

export interface IPlan {
  _id: Types.ObjectId;
  name: string;
  monthlyTokens: number;
  price?: number;
  description?: string;
  isActive: boolean;
}
