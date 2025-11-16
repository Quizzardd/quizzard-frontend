import type { IPlan, ISubscription } from '@/types';
import CurrentPlan from './components/CurrentPlan';
import SubscriptionPlans from './components/SubscriptionPlans';
import AiInfo from './components/AiInfo';

export default function SubscriptionPage() {
 const plans: IPlan[] = [
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
  ];
  // 🧠 Static subscription for testing CurrentPlan
  const subscription: ISubscription = {
    _id: 'sub1' ,
    user: 'user1' ,
    plan: plans[1], // current plan is "Free"
    status: 'active' ,
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
      <SubscriptionPlans plans={plans}></SubscriptionPlans>
      <AiInfo />
    </div>
  );
}
