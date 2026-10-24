import Link from "next/link";
import { Home, HelpCircle } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "404 Page Not Found - Study with Asma",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-background">
      {/* Background ambient glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative center grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo className="h-12 w-auto text-primary" />
          </Link>
        </div>

        {/* 404 Glassmorphism Element */}
        <div className="relative p-8 md:p-12 rounded-2xl bg-card/60 backdrop-blur-md border border-border/40 shadow-2xl shadow-primary/5 space-y-6">
          {/* Subtle light reflection highlight at the top border */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Error 404
            </div>

            <h1 className="text-7xl font-extrabold tracking-tight font-serif text-foreground bg-gradient-to-r from-primary via-primary-foreground/90 to-primary bg-clip-text text-transparent dark:from-primary dark:via-purple-300 dark:to-primary leading-none">
              404
            </h1>

            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Lost in Preparation?
            </h2>

            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We couldn't find the page you were looking for. It might have been
              moved, deleted, or perhaps the URL contains a typo.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full sm:w-auto font-medium cursor-pointer shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>

            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto font-medium cursor-pointer transition-colors",
              )}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-muted-foreground">
          Study with Asma &copy; {new Date().getFullYear()}. All rights
          reserved.
        </div>
      </div>
    </div>
  );
}
