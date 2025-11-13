export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  phone?: string;
  location?: string;
  tokenBalance: number;
  createdAt: Date;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}
