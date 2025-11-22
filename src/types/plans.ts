export interface IPlan {
  _id: string;
  name: string;
  price: number;
  stripePriceId: string;
  credits: number;
  description: string;
  feature: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
