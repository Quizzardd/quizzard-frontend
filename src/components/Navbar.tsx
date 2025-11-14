import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./ModeToggle"

export default function Navbar() {
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6l4 2"
            />
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

      {/* Right Section: Notifications + User */}
      <div className="flex items-center gap-5">
        {/* Notification Icon */}
        <div className="relative">
          <Bell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          <span className="absolute -top-1 -right-1 bg-destructive h-2.5 w-2.5 rounded-full" />
        </div>
        <ModeToggle/>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/80 h-9 w-9 flex items-center justify-center transition-colors"
            >
              AD
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-popover text-popover-foreground border border-border shadow-lg"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
