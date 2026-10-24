import Link from "next/link";
import { ArrowUpRight, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Upper Footer: Main Columns */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group"
              aria-label="Study With Asma"
            >
              <Logo className="h-9 sm:h-10 w-auto text-foreground group-hover:text-primary transition-colors" />
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Empowering students through rigorous IELTS preparation and
              authentic, personalized guidance for international university
              admissions in France and Italy.
            </p>

            {/* Quick Contact Badge */}
            <div className="pt-2">
              <a
                href="https://wa.me/213797328745"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Advisory: +213 797 32 87 45</span>
              </a>
            </div>
          </div>

          {/* Column 3: IELTS Preparation */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-foreground">
              IELTS Prep
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/ielts"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  IELTS Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/academic-ielts"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Academic IELTS
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/general-ielts"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  General Training
                </Link>
              </li>
              <li>
                <Link
                  href="/level-test"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Free Level Test</span>
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-sm">
                    15 min
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/request-access"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Request Course Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Study Abroad */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-foreground">
              Destinations
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/destinations/france"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  France
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/italy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Italy
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Destinations</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Academy & Guidance */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-foreground">
              Academy &amp; Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Asma
                </Link>
              </li>
              <li>
                <Link
                  href="/study-abroad"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Study Abroad Guidance
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Articles &amp; Resource Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Book a Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Student Portal Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance & Legal Disclaimer Banner */}
      <div className="border-t border-border/80 bg-muted/40 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <p className="text-[11px] text-muted-foreground leading-relaxed text-center sm:text-left">
            <strong>Advisory Notice:</strong> Study With Asma is an independent
            educational training provider and academic consultancy. We do not
            claim official partnerships with every institution featured on this
            website. Admissions decisions and visa approvals are strictly
            determined by independent universities, faculties, and sovereign
            immigration departments.
          </p>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Terms */}
      <div className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} Study With Asma. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Support
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              Qualifications &amp; Ethics
            </Link>
            <a
              href="mailto:asma@studywithasma.com"
              className="hover:text-foreground transition-colors"
            >
              asma@studywithasma.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
