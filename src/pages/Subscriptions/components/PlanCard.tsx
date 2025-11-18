import type { IPlan } from '@/types';
import type { JSX } from 'react';

interface PlanCardProps {
  plan: IPlan;
  currentPlanId?: string; // The user's current subscription plan ID
}

export function PlanCard({ plan, currentPlanId }: PlanCardProps): JSX.Element {
  const isFree = !plan.price || plan.price === 0;
  const isCurrentPlan = currentPlanId === plan._id; // User's active subscription
  const isPro = plan.name.toLowerCase().includes('pro');
  const isPlus = plan.name.toLowerCase().includes('plus');

  return (
    <div
      key={plan._id.toString()}
      className={`relative flex flex-col justify-between rounded-2xl border bg-card text-card-foreground shadow-sm transition hover:shadow-md ${
        isCurrentPlan ? 'border-primary ring-1 ring-primary/20' : 'border-border'
      }`}
    >
      {/* Optional badge for most popular plan */}
      {isPlus && (
        <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Most Popular
        </span>
      )}

      {/* Header */}
      <div className="p-6">
        <h3 className="text-lg font-semibold capitalize">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.credits} credits/month</p>
      </div>

      {/* Body */}
      <div className="flex flex-col grow px-6 pb-6">
        <div>
          <p className="text-3xl font-bold">{isFree ? 'Free' : `$${plan.price?.toFixed(2)}/mo`}</p>
          {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
        </div>

        {/* Dynamic Features */}
        {plan.feature?.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {plan.feature.map((feat, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                {feat}
              </li>
            ))}
          </ul>
        )}

        {/* Button pinned to bottom */}
        <div className="mt-auto pt-6">
          <button
            disabled={isCurrentPlan || isFree}
            className={`w-full rounded-lg py-2.5 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                isCurrentPlan || isFree
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
                  : isPro
                    ? 'bg-[#9333ea] text-white hover:bg-[#7e22ce] cursor-pointer'
                    : isPlus
                      ? 'bg-primary text-primary-foreground hover:bg-blue-700 cursor-pointer'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 cursor-pointer'
              }`}
          >
            {isCurrentPlan ? 'Current Plan' : isFree ? 'Free' : `Upgrade to ${plan.name}`}
          </button>
        </div>
      </div>
    </div>
  );
}
