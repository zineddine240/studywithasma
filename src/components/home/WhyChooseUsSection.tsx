"use client";

import { useRef } from "react";
import {
  Building2,
  Globe2,
  Users2,
  GraduationCap,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { SectionTag } from "@/components/ui/section-tag";

const STATS = [
  {
    number: "Band 7.5+",
    label: "Average Student Score",
    icon: Award,
    circleBg: "bg-amber-400 text-slate-950",
  },
  {
    number: "98%",
    label: "Visa Approval Rate",
    icon: CheckCircle2,
    circleBg: "bg-blue-600 text-white",
  },
  {
    number: "1000+",
    label: "Students Placed Abroad",
    icon: Users2,
    circleBg: "bg-amber-400 text-slate-950",
  },
  {
    number: "€0 Tuition",
    label: "Through DSU Grants",
    icon: GraduationCap,
    circleBg: "bg-blue-600 text-white",
  },
];

export default function WhyChooseUsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const items = statsRef.current?.children;
      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: statsRef.current,
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
      className="py-20 lg:py-28 bg-background relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  text-center">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto space-y-3 mb-16 sm:mb-20">
          <SectionTag>WHY US</SectionTag>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-foreground tracking-tight">
            Why Choose Us
          </h2>
        </div>

        {/* 4 Circular Stat Badges Grid (Matching Porbe's exact layout) */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.number}
                className="flex flex-col items-center text-center space-y-4 group"
              >
                {/* Circular Icon with Porbe's styling */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${stat.circleBg} flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-9 h-9 sm:w-11 sm:h-11" />
                </div>

                {/* Big Number */}
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-serif font-extrabold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium max-w-[200px] leading-snug">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
