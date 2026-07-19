"use client";

import { Menu, Bell, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface PortalTopBarProps {
  onOpenSidebar: () => void;
  userEmail?: string;
  isExpanded?: boolean;
  setIsExpanded?: (val: boolean) => void;
}

export function PortalTopBar({
  onOpenSidebar,
  userEmail,
  isExpanded,
  setIsExpanded,
}: PortalTopBarProps) {
  const name = userEmail ? userEmail.split("@")[0] : "Student";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-background/95 backdrop-blur-sm border-b border-border shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/30"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        {setIsExpanded && isExpanded !== undefined && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <ThemeToggle />

        <button
          className="relative p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted/30"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 border-l border-border pl-4 sm:pl-6 cursor-pointer focus:outline-none">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-sm uppercase">
              {initial}
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 mt-1 border border-border bg-popover p-1.5 text-popover-foreground rounded-xl">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Signed in as
            </DropdownMenuLabel>
            <div className="px-3 pb-2 pt-0.5 text-sm font-bold truncate">
              {userEmail || "student@studywithasma.com"}
            </div>
            
            <DropdownMenuSeparator className="my-1 border-t border-border/50" />
            
            <DropdownMenuItem
              render={<Link href="/student-portal/profile" />}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted cursor-pointer transition-colors w-full focus:outline-none"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              Profile Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 border-t border-border/50" />

            <form
              action="/auth/signout"
              method="post"
              className="w-full"
            >
              <DropdownMenuItem
                render={<button type="submit" />}
                nativeButton
                className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 cursor-pointer transition-colors focus:outline-none"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
