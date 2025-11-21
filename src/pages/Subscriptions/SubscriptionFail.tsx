import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionFail() {
  const navigate = useNavigate();

  useEffect(() => {
    // You can add analytics tracking here
    console.log('Subscription failed');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-3xl text-red-600 dark:text-red-400">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-lg font-medium">We couldn't process your payment</p>
            <p className="text-muted-foreground">
              Unfortunately, your payment could not be completed. This could be due to insufficient
              funds, an expired card, or your bank declining the transaction.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-900 dark:text-yellow-200">
              <strong>What to do next?</strong>
              <br />
              Please check your payment information and try again. If the problem persists, contact
              your bank or try a different payment method.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={() => navigate('/')} variant="outline">
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate('/subscription')}>Try Again</Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team at support@quizzard.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
