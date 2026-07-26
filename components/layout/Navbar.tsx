"use client";

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isTransparent = isHome && !scrolled;

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
      } catch (err) {
        setRole("student");
      } finally {
        setLoading(false);
      }
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      fetchUserRole(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      fetchUserRole(currentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`top-0 z-50 w-full transition-colors duration-300 ${
        isHome ? "fixed" : "sticky"
      } ${
        isTransparent
          ? "bg-transparent border-transparent"
          : `bg-background/95 backdrop-blur-md ${scrolled ? 'border-b border-border shadow-sm' : 'border-transparent shadow-none'}`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Logo className={`h-10 sm:h-12 w-auto transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-primary'}`} />
          </Link>
          <div className="hidden md:flex space-x-8">
            {[
              { name: 'Home', href: '/' },
              { name: 'Courses', href: '/courses' },
              { name: 'About Us', href: '/about' },
              { name: 'Contact', href: '/contact' },
            ].map((link) => {
              const isActive = pathname === link.href;
              
              let linkClass = "font-medium transition-colors duration-300 ";
              if (isTransparent) {
                linkClass += isActive ? "text-white font-bold" : "text-white/80 hover:text-white";
              } else {
                linkClass += isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-primary";
              }

              return (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2 min-h-11">
            <ThemeToggle />
            {!loading && (
              user ? (
                <Link
                  href={role === "admin" || role === "teacher" ? "/admin" : "/student-portal"}
                  className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`hidden sm:inline-flex font-medium transition-colors duration-300 px-2 ${isTransparent ? 'text-white/90 hover:text-white' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/request-access"
                    className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    Request Access
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
