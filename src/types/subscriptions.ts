import type { IUser } from './users';
import type { IPlan } from './plans';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface ISubscription {
  _id: string;
  user: string | IUser;
  plan: IPlan;
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
