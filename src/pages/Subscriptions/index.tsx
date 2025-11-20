import CurrentPlan from './components/CurrentPlan';
import SubscriptionPlans from './components/SubscriptionPlans';
import AiInfo from './components/AiInfo';
import { useMySubscription } from '@/hooks/useSubscription';

export default function SubscriptionPage() {
  const { data: subscription, isLoading } = useMySubscription();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background m-4 p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading subscription...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background m-4 p-6">
      {subscription && <CurrentPlan subscription={subscription} />}
      <SubscriptionPlans currentPlanId={subscription?.plan?._id} />
      <AiInfo />
    </div>
  );
}
