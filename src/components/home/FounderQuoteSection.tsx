"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";

export default function FounderQuoteSection() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;
      if (!cardRef.current) return;

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="py-14 sm:py-20 bg-background relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
        <div
          ref={cardRef}
          className="relative bg-[#183ce4] text-white rounded-3xl sm:rounded-4xl p-8 sm:p-14 lg:p-16 shadow-2xl overflow-hidden text-center"
        >
          {/* Subtle radial glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            {/* Founder Avatar with Gold Accent Border */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
                  alt="Asma Belhadj, Lead Mentor"
                  fill
                  sizes="96px"
                  className="object-cover object-top"
                />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                  Asma Belhadj
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  Founder &amp; Senior IELTS Trainer, Study With Asma
                </p>
              </div>
            </div>

            {/* Quote Typography */}
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif font-extrabold text-white leading-snug">
              &ldquo;At Study with Asma, we don&apos;t just guide students
              abroad — we open doors to futures without borders.&rdquo;
            </blockquote>

            {/* Amber Action Button */}
            <div className="pt-2 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg shadow-slate-950/20 hover:-translate-y-0.5 transition-all group"
              >
                <span>Book a Consultation</span>
                <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
