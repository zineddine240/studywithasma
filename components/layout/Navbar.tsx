"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Logo className="h-10 sm:h-12 w-auto text-primary" />
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-muted-foreground hover:text-primary font-medium transition-colors">Home</Link>
            <Link href="/courses" className="text-muted-foreground hover:text-primary font-medium transition-colors">Courses</Link>
            <Link href="/about" className="text-muted-foreground hover:text-primary font-medium transition-colors">About Us</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary font-medium transition-colors">Contact</Link>
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
                    className="hidden sm:inline-flex text-muted-foreground hover:text-primary font-medium transition-colors px-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/request-access"
                    className="bg-primary text-[#FFFFFF] px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors"
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
