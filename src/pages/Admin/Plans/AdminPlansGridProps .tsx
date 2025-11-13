import type { IPlan } from '@/types';
import type { JSX } from 'react';
import { AdminPlanCard } from './AdminPlans';

interface AdminPlansGridProps {
  plans: IPlan[];
  onDelete: (id: string) => void;
  onUpdate: (plan: IPlan) => void;
}

export function AdminPlansGrid({ plans, onDelete, onUpdate }: AdminPlansGridProps): JSX.Element {
  return (
    <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
      {plans.map((plan) => (
        <AdminPlanCard
          key={plan._id}
          plan={plan}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
