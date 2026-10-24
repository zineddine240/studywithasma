"use client";

import { Settings, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
import { User } from "lucide-react";

interface AdminHeaderProps {
  email?: string;
  fullName?: string | null;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
}

export function AdminHeader({ email, fullName, isExpanded, setIsExpanded }: AdminHeaderProps) {
  const displayName = fullName || email || "Admin";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-background flex items-center justify-between px-6 shrink-0 relative z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isExpanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold overflow-hidden border border-primary/30 text-sm">
              {initial}
            </div>
            <span className="text-sm font-semibold text-foreground hidden sm:block max-w-37.5 truncate">
              {displayName}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 mt-1 border border-border bg-popover p-1.5 text-popover-foreground rounded-xl">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Signed in as
            </DropdownMenuLabel>
            <div className="px-3 pb-2 pt-0.5 text-sm font-bold truncate">
              {email || "admin@studywithasma.com"}
            </div>
            
            <DropdownMenuSeparator className="my-1 border-t border-border/50" />
            
            <DropdownMenuItem
              render={<Link href="/admin/profile" />}
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
