import type { IPlan } from '@/types';
import type { JSX } from 'react';
import { Button } from '@/components/ui/button';

interface AdminPlanCardProps {
  plan: IPlan;
  onDelete: (id: string) => void;
  onUpdate: (plan: IPlan) => void;
}

export function AdminPlanCard({ plan, onDelete, onUpdate }: AdminPlanCardProps): JSX.Element {
  const isPro = plan.name.toLowerCase().includes('pro');
  const isPlus = plan.name.toLowerCase().includes('plus');

  return (
    <div
      key={plan._id.toString()}
      className={`relative flex flex-col justify-between rounded-2xl border bg-card text-card-foreground shadow-sm transition hover:shadow-md ${
        plan.isActive ? 'border-primary ring-1 ring-primary/20' : 'border-border'
      }`}
    >
      {/* Optional badge */}
      {isPlus && (
        <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Most Popular
        </span>
      )}

      {/* Header */}
      <div className="p-6">
        <h3 className="text-lg font-semibold capitalize">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.monthlyTokens} tokens/month</p>
      </div>

      {/* Body */}
      <div className="flex flex-col grow px-6 pb-6">
        <div>
          <p className="text-3xl font-bold">{plan.price ? `$${plan.price.toFixed(2)}/mo` : 'Free'}</p>
          {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
        </div>

        {plan.features?.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Admin Actions */}
        <div className="mt-auto pt-6 flex gap-3">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => onDelete(plan._id.toString())}
          >
            Delete
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onUpdate(plan)}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
