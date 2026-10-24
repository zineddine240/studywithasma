"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { SectionTag } from "@/components/ui/section-tag";

export default function AboutAsmaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const badgeLeftRef = useRef<HTMLDivElement>(null);
  const badgeRightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, clearProps: "all" },
      )
        .fromTo(
          visualRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, clearProps: "all" },
          "-=0.4",
        )
        .fromTo(
          [badgeLeftRef.current, badgeRightRef.current],
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            clearProps: "all",
          },
          "-=0.3",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#183ce4] text-white relative overflow-hidden"
    >
      {/* Decorative ambient radial background rings */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      {/* Subtle curved background lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  relative z-10 text-center">
        {/* Top Header & Copy */}
        <div
          ref={contentRef}
          className="max-w-3xl mx-auto space-y-6 mb-12 sm:mb-16"
        >
          {/* White Category Badge */}
          <SectionTag variant="white">ABOUT US</SectionTag>

          {/* Large Bold Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
            Behind Every Student&apos;s Journey Is A Mentor Dedicated To Making
            Study Abroad Simple And Rewarding.
          </h2>

          {/* Amber CTA Button */}
          <div className="pt-2 flex justify-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-xl shadow-slate-950/20 hover:-translate-y-0.5 transition-all group"
            >
              <span>More About Asma</span>
              <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Central Visual with Overlapping Student Photos & Floating Circular Badges */}
        <div
          ref={visualRef}
          className="relative max-w-4xl mx-auto mt-8 sm:mt-12"
        >
          {/* Overlapping Rounded Photo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
            {/* Photo 1: Left */}
            <div className="relative aspect-4/3 rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl border-4 border-white/20 bg-blue-900">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
                alt="Students collaborating on study abroad dossier"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Photo 2: Right */}
            <div className="relative aspect-4/3 rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl border-4 border-white/20 bg-blue-900">
              <Image
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop"
                alt="Happy students after successful visa approval"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Floating Circular Badge Left: 1000+ Mentored (Navy Circle) */}
          <div
            ref={badgeLeftRef}
            className="hidden md:flex absolute -top-8 -left-8 w-28 h-28 rounded-full bg-slate-950 text-white border-2 border-white/80 shadow-2xl flex-col items-center justify-center text-center p-2 z-20"
          >
            <span className="text-xl font-extrabold text-amber-400">1000+</span>
            <span className="text-[10px] font-semibold text-white/80 leading-tight">
              Students Placed Worldwide
            </span>
          </div>

          {/* Floating Circular Badge Right: 98% Visa Acceptance (Orange/Amber Circle) */}
          <div
            ref={badgeRightRef}
            className="hidden md:flex absolute -top-8 -right-8 w-28 h-28 rounded-full bg-amber-500 text-slate-950 border-2 border-white/80 shadow-2xl flex-col items-center justify-center text-center p-2 z-20"
          >
            <span className="text-xl font-extrabold text-slate-950">98%</span>
            <span className="text-[10px] font-bold text-slate-900 leading-tight">
              Visa Approval Rate
            </span>
          </div>
        </div>

        {/* Bottom Three Highlights (Matching Porbe's bullet points) */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-semibold text-white/90">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Tailored Educational Pathways</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>End-to-End Guidance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>High IELTS Success Rates</span>
          </div>
        </div>
      </div>
    </section>
  );
}
