import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";

export function HeroHeadline() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5 z-20 px-4 pb-8 sm:pb-12 md:pb-14">
      {/* Category Kicker with Blue Square Pip */}
      <div className="hero-kicker">
        <SectionTag>TOP GLOBAL STUDY SPOTS</SectionTag>
      </div>

      {/* Big Porbe-Style Display Headline */}
      <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08]">
        Explore Top Study <br className="hidden sm:inline" />
        Abroad{" "}
        <span className="text-blue-600 dark:text-blue-500">
          Destinations.
        </span>
      </h1>

      {/* Concise 1-Sentence Subtitle (Anti-AI Text Bloat Rule) */}
      <p className="hero-desc text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
        Study with Asma guides you to master IELTS and secure English-taught
        degree admissions and scholarships in France and Italy.
      </p>

      {/* Saturated Amber Pill CTA Button with Dark Right Arrow */}
      <div className="hero-button pt-2 flex justify-center relative z-30">
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <span>Register Now</span>
          <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default HeroHeadline;
