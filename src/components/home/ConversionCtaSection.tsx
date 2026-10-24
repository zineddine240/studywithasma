"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";

export default function ConversionCtaSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;
      if (!containerRef.current) return;

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.96, y: 40 },
        {
          opacity: 1,
          scale: 1,
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
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_500px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
        <div
          ref={containerRef}
          className="relative bg-linear-to-b from-[#183ce4] to-blue-900 rounded-3xl sm:rounded-4xl p-10 sm:p-16 lg:p-20 text-white text-center shadow-2xl overflow-hidden"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Circular Student Avatars (Matching Porbe's banner) */}
          <div className="hidden md:block absolute top-8 left-12 w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="Student"
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="hidden md:block absolute bottom-8 left-20 w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
              alt="Student"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="hidden md:block absolute top-10 right-14 w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
              alt="Student"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="hidden md:block absolute bottom-10 right-16 w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
              alt="Student"
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          {/* Central Content */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* Headline (Porbe-Style) */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
              Are you prepared to soar and chase your dreams?
            </h2>

            {/* Amber Action Button */}
            <div className="pt-2 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-4 rounded-full text-sm sm:text-base shadow-xl shadow-slate-950/20 hover:-translate-y-0.5 transition-all group"
              >
                <span>Book a Consultation</span>
                <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-white/70">
              <span>Have quick questions?</span>
              <a
                href="https://wa.me/213797328745"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:underline font-bold inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+213 797 32 87 45)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
