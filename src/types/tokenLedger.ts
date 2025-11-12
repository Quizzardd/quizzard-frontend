import { Types } from 'mongoose';
import type { IUser } from './users';
import type { ISubscription } from './subscriptions';

export type TokenReason = 'quiz_generation' | 'answer_explanation' | 'manual_adjustment';

export interface ITokenLedger {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  subscription?: Types.ObjectId | ISubscription;
  amount: number;
  reason: TokenReason;
  relatedEntity?: Types.ObjectId;
  balanceAfter?: number;
  createdAt: Date;
}
