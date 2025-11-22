import { Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full border-2 border-dashed border-primary/30">
        <CardContent className="pt-10 pb-10">
          <div className="text-center space-y-6">
            {/* Animated Icon */}
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-ping opacity-20">
                <Clock className="h-20 w-20 text-primary" />
              </div>
              <Clock className="h-20 w-20 text-primary relative animate-pulse" />
            </div>

            {/* Title with gradient */}
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Coming Soon
              </h2>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <p className="text-muted-foreground text-lg">We're working on something amazing!</p>
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              This feature is currently under development. Stay tuned for updates!
            </p>

            {/* Animated dots */}
            <div className="flex justify-center gap-2 pt-4">
              <span className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-3 w-3 bg-primary rounded-full animate-bounce"></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
