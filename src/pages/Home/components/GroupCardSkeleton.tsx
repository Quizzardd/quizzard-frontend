import { ShieldCheck, GraduationCap, Users, BookOpen, Clock } from 'lucide-react';

export default function GroupCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm animate-pulse overflow-hidden">
      {/* Top Cover Image + Role Badge */}
      <div className="relative">
        <div className="w-full h-40 md:h-48 bg-muted"></div>
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Role
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-5">
        {/* Title & Owner */}
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-muted rounded"></div>
          <div className="h-3 w-1/2 bg-muted rounded"></div>
        </div>

        {/* Members + Modules */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div className="h-3 w-16 bg-muted rounded"></div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <div className="h-3 w-16 bg-muted rounded"></div>
          </div>
        </div>

        {/* Joined Date Badge */}
        <div className="flex items-center gap-2 text-xs bg-muted/20 font-medium py-3 px-3 rounded-lg">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <div className="h-3 w-24 bg-muted rounded"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-9 bg-muted rounded-lg"></div>
          <div className="flex-1 h-9 bg-muted rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
