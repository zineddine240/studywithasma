"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  User as UserIcon,
} from "lucide-react";
import type {
  User,
  UserResponse,
  AuthChangeEvent,
  Session,
} from "@supabase/supabase-js";
import { Logo } from "./Logo";
import { createClient } from "@/utils/supabase/client";

interface NavLinkItem {
  label: string;
  href: string;
  matchPattern?: RegExp;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "IELTS Preparation", href: "/ielts", matchPattern: /^\/(ielts|courses|level-test)/ },
  { label: "Study Abroad", href: "/destinations", matchPattern: /^\/(study-abroad|destinations)/ },
  { label: "Our Services", href: "/services", matchPattern: /^\/services/ },
  { label: "Resources", href: "/resources", matchPattern: /^\/resources/ },
  { label: "About Asma", href: "/about", matchPattern: /^\/about/ },
  { label: "Contact", href: "/contact", matchPattern: /^\/contact/ },
];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Calculate and update sliding indicator position
  useEffect(() => {
    const updatePosition = () => {
      const activeIndex = NAV_LINKS.findIndex((link) => {
        if (link.href === "/") {
          return pathname === "/";
        }
        return link.matchPattern
          ? link.matchPattern.test(pathname)
          : pathname === link.href;
      });

      if (activeIndex !== -1 && navLinksRef.current[activeIndex]) {
        const el = navLinksRef.current[activeIndex];
        if (el) {
          setIndicatorStyle({
            left: el.offsetLeft,
            width: el.offsetWidth,
            opacity: 1,
          });
        }
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updatePosition();

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(updatePosition);
    }

    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [pathname]);

  // Close mobile menu and search modal on route change during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setSearchModalOpen(false);
  }

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch Supabase user & role
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    async function fetchUserRole(currentUser: User | null) {
      if (!currentUser || !supabase) {
        setRole(null);
        return;
      }
      try {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();
        setRole(data?.role || "student");
      } catch {
        setRole("student");
      }
    }

    supabase.auth
      .getUser()
      .then((res: UserResponse) => {
        const currentUser = res.data?.user ?? null;
        setUser(currentUser);
        fetchUserRole(currentUser);
      })
      .catch(() => {});

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        fetchUserRole(currentUser);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo on the left */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-hidden rounded-lg py-1 shrink-0"
            aria-label="Study With Asma"
          >
            <Logo className="h-8 sm:h-9 w-auto text-[#0B1536] group-hover:text-indigo-600 transition-colors" />
          </Link>

          {/* Desktop Navigation Links with Smooth Sliding Active Indicator */}
          <nav
            ref={navRef}
            className="relative hidden lg:flex items-center space-x-6 xl:space-x-8 py-2 shrink-0"
          >
            {NAV_LINKS.map((link, index) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : link.matchPattern
                  ? link.matchPattern.test(pathname)
                  : pathname === link.href;

              return (
                <Link
                  key={link.label}
                  ref={(el) => {
                    navLinksRef.current[index] = el;
                  }}
                  href={link.href}
                  onClick={() => {
                    const el = navLinksRef.current[index];
                    if (el) {
                      setIndicatorStyle({
                        left: el.offsetLeft,
                        width: el.offsetWidth,
                        opacity: 1,
                      });
                    }
                  }}
                  className={`relative py-1 text-sm select-none transition-colors duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? "text-slate-950 font-bold"
                      : "text-slate-600 hover:text-slate-950 font-medium"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Sliding Underline Bar */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-0.5 bg-[#F59E0B] rounded-full pointer-events-none will-change-transform"
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
                transition:
                  "transform 300ms cubic-bezier(0.25, 1, 0.5, 1), width 300ms cubic-bezier(0.25, 1, 0.5, 1), opacity 150ms ease",
              }}
            />
          </nav>

          {/* Right Action Items: Search Icon & Get in Touch Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Icon Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Search"
              title="Search courses & destinations (Ctrl+K)"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </button>

            {/* Authenticated user shortcut OR Log In button */}
            {user ? (
              <Link
                href={role === "admin" ? "/admin" : "/student-portal"}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{role === "admin" ? "Admin" : "Portal"}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span>Log In</span>
              </Link>
            )}

            {/* "Get in Touch" Purple Pill Button */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-150 shadow-xs cursor-pointer"
            >
              Get in Touch
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-4 pb-6 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : link.matchPattern
                    ? link.matchPattern.test(pathname)
                    : pathname === link.href;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-amber-50 text-amber-900 border-l-4 border-[#F59E0B]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <Link
                  href={role === "admin" ? "/admin" : "/student-portal"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-full text-sm font-bold bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  {role === "admin" ? "Admin Dashboard" : "Student Portal"}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-full text-sm font-semibold border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  <span>Log In</span>
                </Link>
              )}

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-5 rounded-full text-sm font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-xs transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search courses, destinations, resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base outline-hidden text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Links in Search Modal */}
            <div className="p-4 max-h-80 overflow-y-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                Destinations
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/destinations/france"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 border border-slate-100 text-xs font-semibold text-slate-800"
                >
                  <span>🇫🇷</span>
                  <span>Study in France</span>
                </Link>
                <Link
                  href="/destinations/italy"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 border border-slate-100 text-xs font-semibold text-slate-800"
                >
                  <span>🇮🇹</span>
                  <span>Study in Italy</span>
                </Link>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                  IELTS Preparation
                </span>
                <Link
                  href="/courses"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between border border-slate-100 text-xs font-semibold text-slate-800"
                >
                  <span>Explore All IELTS Courses</span>
                  <span className="text-indigo-600">View →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
