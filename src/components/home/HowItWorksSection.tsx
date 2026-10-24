"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { SectionTag } from "@/components/ui/section-tag";
import { PROCESS_STEPS } from "./how-it-works/process-data";
import { ProcessStepColumn } from "./how-it-works/ProcessStepColumn";
import { ProcessMediaBanner } from "./how-it-works/ProcessMediaBanner";

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const waveLineRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      // Animate roadmap cards and wave line
      tl.fromTo(
        timelineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, clearProps: "all" },
      );

      if (waveLineRef.current) {
        gsap.set(waveLineRef.current, {
          strokeDasharray: 1000,
          strokeDashoffset: 1000,
        });

        tl.to(
          waveLineRef.current,
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
          },
          "-=0.5",
        );
      }

      tl.from(
        mediaRef.current,
        {
          scale: 0.95,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#f4f7fe] dark:bg-slate-950 relative overflow-hidden transition-colors"
      id="how-it-works"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 text-center">
        {/* ========================================================================= */}
        {/* SECTION HEADER (Exact Porbe Pill Kicker & Headline) */}
        {/* ========================================================================= */}
        <div className="max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
          <SectionTag>WORKING PROCESS</SectionTag>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">
            How it Works
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* PORBE 5-STAGE ALTERNATING ROADMAP WITH CONTINUOUS CUBIC BEZIER WAVE */}
        {/* ========================================================================= */}
        <div
          ref={timelineRef}
          className="relative w-full mx-auto mb-16 sm:mb-24"
        >
          {/* Desktop 5-Column Alternating Layout */}
          <div className="hidden lg:block relative h-[360px]">
            {/* Continuous Cubic Bezier Curved Wave Connecting All 5 Steps */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 1000 360"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                ref={waveLineRef}
                pathLength={1000}
                d="M 100,150 C 200,150 200,210 300,210 C 400,210 400,150 500,150 C 600,150 600,210 700,210 C 800,210 800,150 900,150"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-300/80 dark:text-blue-700/60"
              />
            </svg>

            {/* 5 Vertical Columns */}
            <div className="grid grid-cols-5 gap-6 relative z-10 h-full">
              {PROCESS_STEPS.map((step) => (
                <ProcessStepColumn key={step.step} step={step} />
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Linear Steps Card List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden text-left">
            {PROCESS_STEPS.map((s) => (
              <div
                key={s.step}
                className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md shadow-blue-900/5 dark:shadow-black/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-200/50 dark:border-slate-700">
                    {s.step}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {s.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.mobileDesc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WIDE ADVISORY PHOTO WITH CENTRAL AMBER PLAY / CONSULTATION ACTION */}
        {/* ========================================================================= */}
        <ProcessMediaBanner ref={mediaRef} />
      </div>
    </section>
  );
}
