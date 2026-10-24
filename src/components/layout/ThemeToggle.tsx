"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch - only render after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder with same dimensions so layout doesn't shift
    return (
      <div className={`w-9 h-9 rounded-full ${className}`} aria-hidden="true" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun icon - shown in dark mode */}
      <Sun
        className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-75"
        }`}
      />
      {/* Moon icon - shown in light mode */}
      <Moon
        className={`w-5 h-5 transition-all duration-300 ${
          isDark
            ? "opacity-0 -rotate-90 scale-75"
            : "opacity-100 rotate-0 scale-100"
        }`}
      />
    </button>
  );
}
