import type { ISubscription } from '@/types';
import type { JSX } from 'react';

interface CurrentPlanProps {
  subscription: ISubscription;
}

function CurrentPlan({ subscription }: CurrentPlanProps): JSX.Element {
  const plan = subscription.plan; // cast if populated plan is an object
  const isFree = !plan?.price || plan?.price === 0;

  const usedTokens = subscription.tokensAllocated - subscription.tokensRemaining;
  const progress =
    subscription.tokensAllocated > 0 ? (usedTokens / subscription.tokensAllocated) * 100 : 0;

  const nextReset = new Date(subscription.nextRenewal || subscription.endDate).toLocaleDateString();

  return (
    <div className="w-full rounded-2xl border bg-card text-card-foreground shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            Current Plan: <span className="capitalize text-primary">{plan?.name}</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {isFree ? 'You are using the Free tier' : 'Active paid subscription'}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isFree
              ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              : 'bg-primary/10 text-primary'
          }`}
        >
          {plan?.name} Plan
        </span>
      </div>

      {/* Tokens Section */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <p className="font-medium text-foreground">AI Tokens Remaining</p>
          <p className="text-muted-foreground">
            {subscription.tokensRemaining} / {subscription.tokensAllocated}
          </p>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${100 - progress}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          Resets on <span className="font-medium">{nextReset}</span>
        </p>
      </div>

      {/* Optional Auto-Renew info */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Auto-renew:{' '}
          <span
            className={`font-medium ${subscription.autoRenew ? 'text-green-600' : 'text-red-500'}`}
          >
            {subscription.autoRenew ? 'Enabled' : 'Disabled'}
          </span>
        </p>

        {!isFree && (
          <button className="rounded-md border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition cursor-pointer">
            Manage Billing
          </button>
        )}
      </div>
    </div>
  );
}

export default CurrentPlan;
