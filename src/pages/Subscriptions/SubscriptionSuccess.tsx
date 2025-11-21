import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate subscription query to refresh user's subscription data
    queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
    toast.success('Subscription activated successfully!');
    console.log('Subscription successful');
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl text-green-600 dark:text-green-400">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-lg font-medium">Thank you for subscribing to Quizzard!</p>
            <p className="text-muted-foreground">
              Your subscription has been activated successfully. You now have access to all the
              premium features included in your plan.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>What's next?</strong>
              <br />
              Your credits have been added to your account and you can start using them right away.
              Check your profile to see your updated subscription details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={() => navigate('/profile')} variant="outline">
              View Profile
            </Button>
            <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
