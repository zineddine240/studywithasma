"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";

export default function NewIeltsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const flatlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      if (flatlayRef.current) {
        gsap.fromTo(
          flatlayRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: flatlayRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 bg-[#FAFAFC] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <div
            ref={leftColRef}
            className="lg:col-span-5 space-y-4 sm:space-y-5"
          >
            <div>
              <SectionTag>
                <span className="uppercase font-bold tracking-wider">
                  IELTS PREPARATION
                </span>
              </SectionTag>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight leading-[1.18]">
              Master IELTS with Confidence
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md">
              Join Asma&apos;s intensive live classes and recorded sessions. Get
              the personal guidance you need to achieve your dream band score.
            </p>

            <div className="pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-7 py-3.5 rounded-full text-base transition-all duration-200 shadow-xs hover:gap-3 cursor-pointer"
              >
                <span>Explore IELTS Courses</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Full IELTS Preparation Photograph */}
          <div ref={flatlayRef} className="lg:col-span-7">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100 group">
              <Image
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop"
                alt="Student preparing for IELTS exam with notebook and laptop"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
