
import type { IUser } from './users';
import type { ISubscription } from './subscriptions';

export type TokenReason = 'quiz_generation' | 'answer_explanation' | 'manual_adjustment';

export interface ITokenLedger {
  _id: string;
  user: string | IUser;
  subscription?: string | ISubscription;
  amount: number;
  reason: TokenReason;
  relatedEntity?: string;
  balanceAfter?: number;
  createdAt: Date;
}
