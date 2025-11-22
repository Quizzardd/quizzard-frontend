export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female';
  photoURL?: string;
}
