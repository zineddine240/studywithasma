"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import {
  LayoutDashboard,
  FileText,
  Video,
  Megaphone,
  LogOut,
  PlaySquare,
  ChevronLeft,
  ChevronRight,
  Mail,
  BookOpen,
  Users,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: null,
    links: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Enrollments", href: "/admin/enrollments", icon: Users },
    ]
  },
  {
    title: "Academics",
    links: [
      { name: "Courses", href: "/admin/courses", icon: BookOpen },
      { name: "Tests & AI Gen", href: "/admin/tests", icon: FileText },
      { name: "Live Classes", href: "/admin/live-classes", icon: Video },
      { name: "Recorded Lessons", href: "/admin/lessons", icon: PlaySquare },
      { name: "Attachments", href: "/admin/attachments", icon: Paperclip },
    ]
  },
  {
    title: "Communications",
    links: [
      { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
      { name: "Contact Submissions", href: "/admin/contact-submissions", icon: Mail },
    ]
  }
];

interface AdminSidebarProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  unreadContactCount?: number;
}

export function AdminSidebar({ isExpanded, setIsExpanded, unreadContactCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-background border-r transition-all duration-300 z-20",
        isExpanded ? "w-72" : "w-16"
      )}
    >
      <div className="h-16 flex items-center justify-center shrink-0">
        <Link href="/admin" className="flex items-center">
          <Logo className="h-11 w-auto text-primary" iconOnly={!isExpanded} />
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {group.title && (
              <h4 className={cn(
                "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 transition-all duration-300 px-3 mb-2",
                isExpanded ? "opacity-100 block" : "opacity-0 h-0 overflow-hidden"
              )}>
                {group.title}
              </h4>
            )}
            {/* Divider for collapsed view or non-first group */}
            {!isExpanded && groupIdx > 0 && (
              <div className="border-t border-border/60 my-3 mx-1" />
            )}
            
            {group.links.map((link) => {
              // Highlight active state even for sub-routes like /admin/tests/new
              const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              const Icon = link.icon;
              const isContactLink = link.href === "/admin/contact-submissions";
              const showBadge = isContactLink && unreadContactCount > 0;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  title={!isExpanded ? link.name : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="relative shrink-0">
                    <Icon className="w-4 h-4" />
                    {showBadge && !isExpanded && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                    )}
                  </div>
                  {isExpanded && (
                    <span className="flex-1 flex items-center justify-between whitespace-nowrap">
                      {link.name}
                      {showBadge && (
                        <span className="ml-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                          {unreadContactCount}
                        </span>
                      )}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 shrink-0">
        <form action="/auth/signout" method="post" className="w-full">
          <button
            type="submit"
            title={!isExpanded ? "Sign Out" : undefined}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors outline-none",
              !isExpanded && "justify-center px-0"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isExpanded && <span>Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
