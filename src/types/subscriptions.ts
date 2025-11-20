import type { IUser } from './users';
import type { IPlan } from './plans';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface ISubscription {
  _id: string;
  user: string | IUser;
  plan: string | IPlan;
  status: SubscriptionStatus;
  startDate: string | Date;
  endDate: string | Date;
  stripeSubscriptionId?: string;
  isActive: boolean;
  creditsAllocated: number;
  creditsUsed: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
  __v?: number;
}
