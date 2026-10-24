"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { HeroOrbitTrack } from "./hero/HeroOrbitTrack";
import { HeroOrbitNodes } from "./hero/HeroOrbitNodes";
import { HeroPhotoCards } from "./hero/HeroPhotoCards";
import { HeroMobileBadges } from "./hero/HeroMobileBadges";
import { HeroHeadline } from "./hero/HeroHeadline";
import { HeroPathwaySelector } from "./hero/HeroPathwaySelector";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Orbital Ring Reveal
      tl.from(".hero-orbit-svg", {
        scale: 0.94,
        opacity: 0,
        duration: 1,
      })
        // 2. 3 Photo Cards Fan-Out
        .fromTo(
          ".photo-card-left",
          { x: 40, opacity: 0, rotate: 0 },
          { x: 0, opacity: 1, rotate: -12, duration: 0.8 },
          "-=0.6",
        )
        .fromTo(
          ".photo-card-center",
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8 },
          "-=0.6",
        )
        .fromTo(
          ".photo-card-right",
          { x: -40, opacity: 0, rotate: 0 },
          { x: 0, opacity: 1, rotate: 12, duration: 0.8 },
          "-=0.6",
        )
        // 3. Typography & CTA Cascade
        .from(".hero-kicker", { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(".hero-title", { y: 25, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-desc", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          ".hero-button",
          { scale: 0.9, opacity: 0, duration: 0.5 },
          "-=0.3",
        )
        // 4. Orbit Nodes Reveal (Fade in at fixed scale to prevent shrinking artifact on refresh)
        .fromTo(
          ".orbit-card-inner",
          {
            opacity: 0,
          },
          {
            opacity: 1,
            stagger: 0.04,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "all",
          },
          "-=0.5",
        )
        // 5. Dark Pathway Search Bar
        .from(
          ".hero-search-bar",
          { y: 30, opacity: 0, duration: 0.7 },
          "-=0.3",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative pt-6 pb-16 lg:pt-10 lg:pb-24 bg-[#f4f7fe] dark:bg-slate-950 text-center transition-colors overflow-x-clip"
    >
      {/* Subtle Constellation Dot Grid Pattern with Vignette Radial Fade */}
      <div
        className="absolute inset-0 pointer-events-none [background-image:radial-gradient(circle_at_1px_1px,rgba(24,60,228,0.12)_1.2px,transparent_0)] dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1.2px,transparent_0)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_45%,#000_40%,transparent_100%)] z-0"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 z-10">
        {/* ========================================================================= */}
        {/* PORBE UNIFIED ORBITAL STAGE (Encompassing 3 Photos, Headline, & 8 Nodes) */}
        {/* ========================================================================= */}
        <div className="relative mx-auto w-full max-w-[1080px] min-h-0 md:min-h-[920px] lg:min-h-[960px] flex flex-col items-center justify-between gap-4 md:gap-0">
          <HeroOrbitTrack />
          <HeroOrbitNodes />
          <HeroMobileBadges />
          <HeroPhotoCards />
          <HeroHeadline />
        </div>

        {/* ========================================================================= */}
        {/* FLOATING QUICK-PATHWAY SELECTOR (Matching Porbe's dark floating search card) */}
        {/* ========================================================================= */}
        <HeroPathwaySelector />
      </div>
    </section>
  );
}
