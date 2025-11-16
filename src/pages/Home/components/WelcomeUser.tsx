import { useGetMe } from '@/hooks/useUser';
import { Sparkles } from 'lucide-react';

export default function WelcomeUser() {
  const { data: user, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-6 w-40 bg-muted rounded"></div>
        <div className="mt-3 h-4 w-64 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary" />

        <div>
          <h2 className="text-2xl font-bold">
            Welcome back, <span className="text-primary">{user?.firstName}</span> 👋
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Here’s what’s happening in your classroom today.
          </p>
        </div>
      </div>
    </div>
  );
}
