import type { IUser } from './users';
import type { IPlan } from './plans';
import { Types } from 'mongoose';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface ISubscription {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  plan: Types.ObjectId | IPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  nextRenewal?: Date;
  autoRenew: boolean;
  tokensAllocated: number;
  tokensRemaining: number;
  lastTokenReset: Date;
  paymentReference?: string;
  createdAt: Date;
}
