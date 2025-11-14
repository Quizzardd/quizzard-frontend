import type { IPlan } from '@/types';
import type { JSX } from 'react';
import { PlanCard } from './PlanCard';

interface SubscriptionPlansProps {
  plans: IPlan[];
}

function SubscriptionPlans({ plans }: SubscriptionPlansProps): JSX.Element {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
      {plans.map((plan) => (
        <PlanCard key={plan._id.toString()} plan={plan} />
      ))}
    </div>
  );
}

export default SubscriptionPlans;
