export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;

  phone?: string;
  age?: number;
  gender?: 'male' | 'female';

  role: 'user' | 'admin';
  isActive: boolean;
  isConfirmed: boolean;

  photoURL?: string; // you'll add this eventually

  createdAt: string;
  updatedAt: string;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}
