import type { ISubscription, IPlan } from '@/types';
import type { JSX } from 'react';

interface CurrentPlanProps {
  subscription: ISubscription;
}

function CurrentPlan({ subscription }: CurrentPlanProps): JSX.Element {
  const plan = typeof subscription.plan === 'object' ? subscription.plan : null;
  const isFree = !plan?.price || plan?.price === 0;

  const creditsRemaining = subscription.creditsAllocated - subscription.creditsUsed;
  const progress =
    subscription.creditsAllocated > 0
      ? (subscription.creditsUsed / subscription.creditsAllocated) * 100
      : 0;

  const nextReset = new Date(subscription.endDate).toLocaleDateString();

  return (
    <div className="w-full rounded-2xl border bg-card text-card-foreground shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            Current Plan: <span className="capitalize text-primary">{plan?.name || 'Free'}</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {isFree ? 'You are using the Free tier' : 'Active paid subscription'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isFree
                ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {plan?.name || 'Free'} Plan
          </span>
          {!isFree && subscription.isActive && (
            <span className="rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Auto-renewing
            </span>
          )}
        </div>
      </div>

      {/* Tokens Section */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <p className="font-medium text-foreground">AI Credits Remaining</p>
          <p className="text-muted-foreground">
            {creditsRemaining} / {subscription.creditsAllocated}
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

      {/* Status info */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Status:{' '}
          <span
            className={`font-medium ${subscription.isActive ? 'text-green-600' : 'text-red-500'}`}
          >
            {subscription.isActive ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default CurrentPlan;
