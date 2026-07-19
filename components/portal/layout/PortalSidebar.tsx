"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  PlayCircle,
  FileText,
  BarChart3,
  User,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Dashboard", href: "/student-portal", icon: LayoutDashboard },
  { name: "My Course", href: "/student-portal/course", icon: BookOpen },
  { name: "Live Classes", href: "/student-portal/live-classes", icon: Video },
  { name: "Recorded Lessons", href: "/student-portal/recorded-lessons", icon: PlayCircle },
  { name: "Resources", href: "/student-portal/resources", icon: BookOpen },
  { name: "My Progress", href: "/student-portal/progress", icon: BarChart3 },
  { name: "Practice Area", href: "/student-portal/practice", icon: FileText },
  { name: "Profile", href: "/student-portal/profile", icon: User },
];

interface PortalSidebarProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  // Kept for mobile backwards compatibility
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

export function PortalSidebar({
  isExpanded,
  setIsExpanded,
  isOpen = false,
  setIsOpen,
}: PortalSidebarProps) {
  const pathname = usePathname();

  const handleMobileClose = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center justify-center shrink-0">
        <Link href="/student-portal" className="flex items-center" onClick={handleMobileClose}>
          <Logo className="h-11 w-auto text-primary" iconOnly={!isExpanded} />
        </Link>
        {/* Mobile Close Button */}
        <button
          onClick={handleMobileClose}
          className="lg:hidden absolute right-4 p-2 text-muted-foreground hover:text-primary"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              title={!isExpanded ? link.name : undefined}
              onClick={handleMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              <span
                className={cn(
                  "truncate transition-all duration-300",
                  isExpanded ? "opacity-100 w-auto ml-1" : "opacity-0 w-0 ml-0 overflow-hidden"
                )}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border mt-auto">
        <Link
          href="/"
          title={!isExpanded ? "Logout" : undefined}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span
            className={cn(
              "truncate transition-all duration-300",
              isExpanded ? "opacity-100 w-auto ml-1" : "opacity-0 w-0 ml-0 overflow-hidden"
            )}
          >
            Logout
          </span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 z-20 h-full",
          isExpanded ? "w-72" : "w-16"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={handleMobileClose}
        />

        {/* Sidebar Panel */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 w-[280px] bg-card border-r border-border shadow-2xl flex flex-col transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}
