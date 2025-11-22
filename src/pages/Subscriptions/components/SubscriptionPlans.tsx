import type { IPlan } from '@/types';
import type { JSX } from 'react';
import { PlanCard } from './PlanCard';
import { usePlans } from '@/hooks/usePlans';

interface SubscriptionPlansProps {
  currentPlanId?: string; // User's current subscription plan ID
}

function SubscriptionPlans({ currentPlanId }: SubscriptionPlansProps): JSX.Element {
  const { data: plans, isLoading, error } = usePlans();

  // Sort plans by credits in ascending order (Free → Plus → Pro)
  const sortedPlans = plans?.sort((a: IPlan, b: IPlan) => a.credits - b.credits);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Failed to load plans. Please try again.</p>
      </div>
    );
  }

  if (!sortedPlans || sortedPlans.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No plans available.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sortedPlans.map((plan: IPlan) => (
        <PlanCard key={plan._id.toString()} plan={plan} currentPlanId={currentPlanId} />
      ))}
    </div>
  );
}

export default SubscriptionPlans;
