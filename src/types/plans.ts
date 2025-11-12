
export interface IPlan {
  _id: string;
  name: string;
  monthlyTokens: number;
  price?: number;
  description?: string;
  isActive: boolean;
  features: string[];
}
