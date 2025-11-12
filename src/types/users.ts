import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  tokenBalance: number;
  createdAt: Date;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}
