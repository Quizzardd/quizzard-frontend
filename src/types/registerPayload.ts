export interface IRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female';
  photoURL?: string;
}
