"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  PlayCircle,
  FileText,
  MessageSquare,
  BarChart3,
  User,
  LogOut,
  GraduationCap,
  X,
  PenTool,
  Mic,
} from "lucide-react";

const NAV_LINKS = [
  { name: "Dashboard", href: "/student-portal", icon: LayoutDashboard },
  { name: "My Course", href: "/student-portal/course", icon: BookOpen },
  { name: "Live Classes", href: "/student-portal/live-classes", icon: Video },
  { name: "Recorded Lessons", href: "/student-portal/recorded-lessons", icon: PlayCircle },
  { name: "Homework", href: "/student-portal/homework", icon: FileText },
  { name: "Teacher Feedback", href: "/student-portal/feedback", icon: MessageSquare },
  { name: "Resources", href: "/student-portal/resources", icon: BookOpen },
  { name: "My Progress", href: "/student-portal/progress", icon: BarChart3 },
  { name: "Writing Practice", href: "/student-portal/writing-practice", icon: PenTool },
  { name: "Speaking Practice", href: "/student-portal/speaking-practice", icon: Mic },
  { name: "Profile", href: "/student-portal/profile", icon: User },
];

export function PortalSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#EDE9FE] w-72">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-[#EDE9FE]">
        <Link
          href="/student-portal"
          className="flex items-center gap-3 group"
          onClick={() => setIsOpen(false)}
        >
          <div className="bg-[#EDE9FE] p-2 rounded-xl group-hover:bg-[#7C3AED] transition-colors">
            <GraduationCap className="w-5 h-5 text-[#7C3AED] group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-xl text-[#1E1B4B] tracking-tight">
            Study with Asma
          </span>
        </Link>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden ml-auto p-2 text-[#64748B] hover:text-[#7C3AED]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[#FAF7FF] text-[#7C3AED] border border-[#EDE9FE]"
                  : "text-[#64748B] hover:bg-slate-50 hover:text-[#1E1B4B] border border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#EDE9FE]">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-40 w-72">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform lg:hidden transition-transform duration-300 ease-in-out w-72 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
