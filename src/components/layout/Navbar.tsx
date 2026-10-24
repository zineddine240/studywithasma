"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  Globe,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/utils/supabase/client";
import { FranceFlag, ItalyFlag } from "@/components/home/hero/CountryFlags";

interface SubItem {
  name: string;
  href: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  flag?: "france" | "italy";
}

interface DropdownItem {
  name: string;
  href: string;
  subItems: SubItem[];
}

const IELTS_DROPDOWN: DropdownItem = {
  name: "IELTS Prep",
  href: "/ielts",
  subItems: [
    {
      name: "IELTS Overview",
      href: "/ielts",
      description:
        "Structured preparation, live coaching & band 7.5+ strategies",
    },
    {
      name: "All IELTS Courses",
      href: "/courses",
      description:
        "Academic & General training tracks with live writing feedback",
    },
    {
      name: "Free Level Test",
      href: "/level-test",
      description: "Diagnostic assessment to determine your current CEFR band",
      badge: "Free",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
  ],
};

const STUDY_ABROAD_DROPDOWN: DropdownItem = {
  name: "Study Abroad",
  href: "/study-abroad",
  subItems: [
    {
      name: "Consulting Overview",
      href: "/study-abroad",
      description:
        "End-to-end guidance from university matching to visa approval",
    },
    {
      name: "Study in France",
      flag: "france",
      href: "/destinations/france",
      description:
        "Campus France, English-taught Master's & Eiffel scholarships",
      badge: "Popular",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      name: "Study in Italy",
      flag: "italy",
      href: "/destinations/italy",
      description: "Universitaly & DSU regional scholarships (€7,000/yr aid)",
      badge: "DSU Aid",
      badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      name: "Compare Destinations",
      href: "/destinations",
      description:
        "France vs. Italy admissions criteria, tuition & living costs",
    },
  ],
};

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>(
    {
      ielts: false,
      abroad: false,
    },
  );

  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Scroll listener for sticky navbar blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Supabase authenticated user & role
  useEffect(() => {
    const supabase = createClient();

    async function fetchUserRole(currentUser: any) {
      if (!currentUser) {
        setRole(null);
        setLoading(false);
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
      } finally {
        setLoading(false);
      }
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      fetchUserRole(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      fetchUserRole(currentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const toggleMobileExpanded = (key: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isIeltsActive =
    pathname.startsWith("/ielts") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/level-test");

  const isAbroadActive =
    pathname.startsWith("/study-abroad") ||
    pathname.startsWith("/destinations");

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div
        className={`relative mx-auto max-w-6xl w-full bg-[#183ce4] text-white rounded-full border border-white/15 px-3 sm:px-4 xl:px-5 py-3 sm:py-4 pointer-events-auto transition-all duration-300 flex items-center justify-between ${
          scrolled
            ? "bg-[#1432c2]/95 backdrop-blur-md shadow-md shadow-blue-950/20"
            : "shadow-xs"
        }`}
      >
        {/* Brand Logo - In pure crisp white */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg py-1 shrink-0"
            aria-label="Study With Asma"
          >
            <Logo className="h-7 sm:h-8 w-auto text-white group-hover:text-white/90 transition-opacity shrink-0" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-2 shrink-0 mx-auto">
          {/* 2. IELTS Prep Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("ielts")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "ielts" ? null : "ielts")
              }
              className={`flex items-center gap-1 px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isIeltsActive || openDropdown === "ielts"
                  ? "bg-white/20 text-white shadow-xs font-bold"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
              aria-expanded={openDropdown === "ielts"}
            >
              <span>IELTS Prep</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${
                  openDropdown === "ielts" ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {/* Flyout Menu */}
            {openDropdown === "ielts" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-lg p-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="space-y-1">
                  {IELTS_DROPDOWN.subItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="group flex flex-col p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {sub.name}
                        </span>
                        {sub.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              sub.badgeColor ||
                              "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {sub.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Study Abroad Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("abroad")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "abroad" ? null : "abroad")
              }
              className={`flex items-center gap-1 px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isAbroadActive || openDropdown === "abroad"
                  ? "bg-white/20 text-white shadow-xs font-bold"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
              aria-expanded={openDropdown === "abroad"}
            >
              <span>Study Abroad</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${
                  openDropdown === "abroad" ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {/* Flyout Menu */}
            {openDropdown === "abroad" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-lg p-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="space-y-1">
                  {STUDY_ABROAD_DROPDOWN.subItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="group flex flex-col p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1.5">
                          <span>{sub.name}</span>
                          {sub.flag === "france" && (
                            <FranceFlag className="w-4 h-4 inline-block" />
                          )}
                          {sub.flag === "italy" && (
                            <ItalyFlag className="w-4 h-4 inline-block" />
                          )}
                        </span>
                        {sub.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              sub.badgeColor ||
                              "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {sub.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. About Asma */}
          <Link
            href="/about"
            className={`px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
              pathname.startsWith("/about")
                ? "bg-white/20 text-white shadow-xs font-bold"
                : "text-white/85 hover:text-white hover:bg-white/10"
            }`}
          >
            About Asma
          </Link>

          {/* 5. Resources */}
          <Link
            href="/resources"
            className={`px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
              pathname.startsWith("/resources")
                ? "bg-white/20 text-white shadow-xs font-bold"
                : "text-white/85 hover:text-white hover:bg-white/10"
            }`}
          >
            Resources
          </Link>

          {/* 6. Contact */}
          <Link
            href="/contact"
            className={`px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
              pathname.startsWith("/contact")
                ? "bg-white/20 text-white shadow-xs font-bold"
                : "text-white/85 hover:text-white hover:bg-white/10"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 shrink-0">
          <ThemeToggle className="text-white hover:text-white hover:bg-white/15" />

          {!loading && (
            <>
              {user ? (
                <Link
                  href={
                    role === "admin" || role === "teacher"
                      ? "/admin"
                      : "/student-portal"
                  }
                  className="inline-flex items-center gap-1.5 bg-white/15 text-white hover:bg-white/25 px-2.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold whitespace-nowrap transition-colors shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-xs xl:text-sm font-semibold text-white/90 hover:text-white px-2 py-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </Link>
              )}
            </>
          )}

          {/* Book Consultation Button (Porbe-exact white pill button with amber circular arrow icon) */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-white/95 text-slate-950 pl-3.5 sm:pl-4 pr-2 sm:pr-2.5 py-1.5 sm:py-2 rounded-full text-xs xl:text-sm font-extrabold shadow-md hover:shadow-lg transition-all group whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Book Consultation</span>
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </Link>
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex lg:hidden items-center justify-self-end gap-1">
          <ThemeToggle className="text-white hover:text-white hover:bg-white/15" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-white hover:bg-white/15 focus:outline-none cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Matching Royal Blue Architecture) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-3 right-3 sm:left-6 sm:right-6 mt-2 bg-[#183ce4] text-white rounded-3xl shadow-2xl border border-white/15 p-5 space-y-3 z-50 animate-in slide-in-from-top-2 duration-200 pointer-events-auto">
          <div className="flex flex-col gap-1">
            {/* Home */}
            <Link
              href="/"
              className={`px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-between transition-colors ${
                pathname === "/"
                  ? "bg-white/20 text-white font-bold"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <span>Home</span>
            </Link>

            {/* IELTS Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileExpanded("ielts")}
                className="w-full px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-between text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span>IELTS Preparation</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileExpanded.ielts
                      ? "rotate-180 text-white"
                      : "text-white/70"
                  }`}
                />
              </button>
              {mobileExpanded.ielts && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-white/10 rounded-2xl mt-1">
                  {IELTS_DROPDOWN.subItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-white/90 hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span>{sub.name}</span>
                        {sub.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                            {sub.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Study Abroad Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileExpanded("abroad")}
                className="w-full px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-between text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span>Study Abroad (France &amp; Italy)</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileExpanded.abroad
                      ? "rotate-180 text-white"
                      : "text-white/70"
                  }`}
                />
              </button>
              {mobileExpanded.abroad && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-white/10 rounded-2xl mt-1">
                  {STUDY_ABROAD_DROPDOWN.subItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-white/90 hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5">
                          <span>{sub.name}</span>
                          {sub.flag === "france" && (
                            <FranceFlag className="w-4 h-4 inline-block" />
                          )}
                          {sub.flag === "italy" && (
                            <ItalyFlag className="w-4 h-4 inline-block" />
                          )}
                        </span>
                        {sub.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                            {sub.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About Asma */}
            <Link
              href="/about"
              className={`px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-between transition-colors ${
                pathname.startsWith("/about")
                  ? "bg-white/20 text-white font-bold"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <span>About Asma</span>
            </Link>

            {/* Resources */}
            <Link
              href="/resources"
              className={`px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-between transition-colors ${
                pathname.startsWith("/resources")
                  ? "bg-white/20 text-white font-bold"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <span>Resources &amp; Blog</span>
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={`px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-between transition-colors ${
                pathname.startsWith("/contact")
                  ? "bg-white/20 text-white font-bold"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <span>Contact</span>
            </Link>
          </div>

          {/* Mobile Bottom Actions */}
          <div className="pt-3 border-t border-white/15 flex flex-col gap-2">
            {!loading && (
              <>
                {user ? (
                  <Link
                    href={
                      role === "admin" || role === "teacher"
                        ? "/admin"
                        : "/student-portal"
                    }
                    className="w-full text-center py-2.5 rounded-full text-sm font-bold bg-white/15 hover:bg-white/25 text-white transition-colors"
                  >
                    Open Student Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="w-full text-center py-2 rounded-full text-sm font-semibold text-white/90 hover:text-white"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-slate-950 py-3 rounded-full text-sm font-extrabold shadow-lg"
            >
              <span>Book Consultation</span>
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
