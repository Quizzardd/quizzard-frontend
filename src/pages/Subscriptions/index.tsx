import type { ISubscription } from '@/types';
import CurrentPlan from './components/CurrentPlan';
import SubscriptionPlans from './components/SubscriptionPlans';
import AiInfo from './components/AiInfo';

export default function SubscriptionPage() {
  // 🧠 Static subscription for testing CurrentPlan
  // TODO: Replace with real subscription API when implemented
  const subscription: ISubscription = {
    _id: 'sub1',
    user: 'user1',
    plan: {
      _id: '691c29e47dfb41c3a058969c',
      name: 'Plus',
      price: 9.99,
      stripePriceId: 'price_1SUQBVRzdVYdB2fUuivsZQ7Y',
      credits: 200,
      description: 'Perfect for individual developers. Includes basic AI credits.',
      feature: [
        '200 monthly AI credits',
        'Basic analytics',
        'Standard support',
        'Access to all basic tools',
      ],
      isActive: true,
      createdAt: '2025-11-18T08:10:12.639Z',
      updatedAt: '2025-11-18T08:10:12.639Z',
      __v: 0,
    },
    status: 'active',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    nextRenewal: new Date('2025-12-31'),
    autoRenew: false,
    tokensAllocated: 50,
    tokensRemaining: 30,
    lastTokenReset: new Date('2025-11-01'),
    createdAt: new Date('2025-01-01'),
  };

  return (
    <div className="min-h-screen bg-background m-4 p-6">
      <CurrentPlan subscription={subscription}></CurrentPlan>
      <SubscriptionPlans currentPlanId={subscription?.plan?._id} />
      <AiInfo />
    </div>
  );
}
