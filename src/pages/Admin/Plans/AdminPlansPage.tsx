import { useState } from 'react';
import type { IPlan } from '@/types';
import { AdminPlansGrid } from './AdminPlansGridProps ';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<IPlan[]>([
    {
      _id: '1',
      name: 'Free',
      monthlyTokens: 50,
      description: 'Basic access to AI tools',
      features: [
        'Create up to 3 classrooms',
        '50 AI tokens per month',
        'Basic quiz generation',
        'Email support',
      ],
      isActive: true,
    },
    {
      _id: '2',
      name: 'Plus',
      monthlyTokens: 1000,
      price: 9.99,
      description: 'Standard for regular teachers',
      features: [
        'Unlimited classrooms',
        '1000 AI tokens per month',
        'Advanced quiz generation',
        'AI explanations for students',
        'Priority support',
        'Analytics dashboard',
      ],
      isActive: false,
    },
    {
      _id: '3',
      name: 'Pro',
      monthlyTokens: 2500,
      price: 24.99,
      description: 'High-usage tier for power users',
      features: [
        'Everything in Plus',
        '2500 AI tokens per month',
        'Custom AI model training',
        'Bulk quiz generation',
        'Advanced analytics',
        'API access',
        'Dedicated support',
      ],
      isActive: false,
    },
  ]);

  const handleDelete = (id: string) => {
    setPlans((prev) => prev.filter((p) => p._id !== id));
  };

  const handleUpdate = (plan: IPlan) => {
    console.log('Update plan:', plan);
  };

  return <AdminPlansGrid plans={plans} onDelete={handleDelete} onUpdate={handleUpdate} />;
}
