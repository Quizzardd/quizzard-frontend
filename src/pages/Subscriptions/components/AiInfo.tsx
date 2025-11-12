import { Sparkles } from 'lucide-react';

function AiInfo() {
  return (
    <div className="flex gap-4 items-start rounded-2xl bg-info-bg p-6 mt-8 border border-border">
      <div className="p-2 rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">How do AI Tokens work?</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          AI tokens are used when you generate quizzes with AI, get AI explanations, or use other
          AI-powered features. Each feature consumes a different amount of tokens based on
          complexity. Tokens reset monthly based on your plan.
        </p>
      </div>
    </div>
  );
}

export default AiInfo;
