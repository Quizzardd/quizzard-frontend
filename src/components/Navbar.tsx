import { Bell, Search, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGetMe } from '@/hooks/useUser';
import { useRemainingCredits } from '@/hooks/useAICredits';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from './ModeToggle';
import { useNavigate } from 'react-router';

export default function Navbar() {
  const { logout } = useAuth();
  const { data: user } = useGetMe();
  const { data: credits } = useRemainingCredits();
  const navigate = useNavigate();

  // Get user initials from first and last name
  const userInitials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : 'U';

  // Calculate credits percentage
  const creditsPercentage = credits?.creditsAllocated
    ? (credits.creditsRemaining / credits.creditsAllocated) * 100
    : 0;

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-background text-foreground shadow-sm transition-colors z-20 sticky top-0">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold">QUIZZARD</h1>
      </div>

      {/* Middle Section: Search */}
      <div className="flex-1 max-w-xl mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search courses, materials, or quizzes..."
            className="pl-9 bg-muted border-border rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-ring transition-colors"
          />
        </div>
      </div>

      {/* Right Section: AI Tokens + Notifications + User */}
      <div className="flex items-center gap-5">
        {/* AI Tokens Progress */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 min-w-[160px]">
          <Sparkles className="h-4 w-4 text-primary" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">
                {credits?.creditsRemaining ?? 0} / {credits?.creditsAllocated ?? 0}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  creditsPercentage > 50
                    ? 'bg-green-500'
                    : creditsPercentage > 20
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${creditsPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Notification Icon */}

        <ModeToggle />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full h-9 w-9 p-0 hover:bg-accent/80 transition-colors"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL} alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-popover text-popover-foreground border border-border shadow-lg"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* AI Tokens in mobile */}
            <div className="md:hidden px-2 py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Sparkles className="h-3 w-3" />
                <span>AI Tokens</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">
                  {credits?.creditsRemaining ?? 0} / {credits?.creditsAllocated ?? 0}
                </span>
                <span className="text-xs text-muted-foreground">
                  {creditsPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    creditsPercentage > 50
                      ? 'bg-green-500'
                      : creditsPercentage > 20
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${creditsPercentage}%` }}
                />
              </div>
            </div>
            <DropdownMenuSeparator className="md:hidden" />

            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
