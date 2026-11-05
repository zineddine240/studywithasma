"use client";

import { useRef } from "react";
import Link from "next/link";
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

          {/* Right Column: Desk Flatlay with Laptop, Open Notebook & IELTS Books */}
          <div ref={flatlayRef} className="lg:col-span-7">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl bg-linear-to-br from-slate-100 to-slate-200/80 border border-slate-200 shadow-sm p-4 sm:p-6 overflow-hidden flex items-center justify-between">
              {/* Subtle Desk Texture / Laptop Keyboard on the Top Left */}
              <div className="absolute top-2 -left-12 sm:-left-8 w-44 sm:w-60 h-28 sm:h-36 bg-slate-800 rounded-xl shadow-md -rotate-12 border-2 border-slate-700 p-2 opacity-90 pointer-events-none">
                <div className="w-full h-full bg-slate-900 rounded flex flex-col justify-between p-1">
                  <div className="grid grid-cols-6 gap-1 opacity-40">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className="h-2 bg-slate-600 rounded-xs" />
                    ))}
                  </div>
                  <div className="w-16 h-3 bg-slate-700 mx-auto rounded-xs opacity-60" />
                </div>
              </div>

              {/* Center: Open Wire-Bound Spiral Notebook */}
              <div className="relative z-10 mx-auto my-auto bg-white rounded-xl shadow-md border border-slate-200 w-52 sm:w-64 py-5 px-6 rotate-2 transform transition-transform hover:rotate-0 duration-300">
                {/* Spiral Holes on the Left Edge */}
                <div className="absolute -left-2 top-3 bottom-3 flex flex-col justify-between">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-1.5 bg-slate-300 rounded-full border border-slate-400/60 shadow-2xs"
                    />
                  ))}
                </div>

                <div className="text-center space-y-1 select-none">
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                    Target Goal
                  </span>
                  <div className="font-handwriting text-3xl sm:text-4xl font-extrabold text-[#0B1536] leading-none pt-1">
                    IELTS
                  </div>
                  <div className="font-handwriting text-2xl font-bold text-indigo-600">
                    =
                  </div>
                  <div className="font-handwriting text-2xl sm:text-3xl font-bold text-slate-800">
                    Your Future
                  </div>
                  <div className="font-handwriting text-2xl text-rose-500 font-bold">
                    ♡
                  </div>
                </div>
              </div>

              {/* Stylized Sleek Pen next to Notebook */}
              <div className="hidden sm:block absolute left-[56%] top-1/2 -translate-y-1/2 w-2 h-36 bg-slate-900 rounded-full shadow-md rotate-12 z-10 border border-slate-700">
                <div className="w-full h-4 bg-amber-400 rounded-t-full" />
                <div className="w-1 h-6 bg-slate-500 mx-auto mt-2" />
              </div>

              {/* Right Side: Stack of Colorful IELTS Books */}
              <div className="relative z-10 -mr-2 sm:mr-2 w-36 sm:w-48 flex flex-col space-y-1 sm:space-y-1.5 -rotate-3 hover:rotate-0 transition-transform duration-300">
                {/* IELTS Header Label */}
                <div className="bg-slate-950 text-white rounded-t-lg px-3 py-1 text-center shadow-xs">
                  <span className="text-xs sm:text-sm font-extrabold tracking-widest font-sans">
                    IELTS 2026
                  </span>
                </div>

                {/* Book 1: Listening */}
                <div className="bg-[#0284C7] text-white px-3 py-1.5 sm:py-2 rounded shadow-xs flex items-center justify-between border-b-2 border-cyan-800">
                  <span className="text-xs sm:text-sm font-bold tracking-wide">
                    Listening
                  </span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                    B9
                  </span>
                </div>

                {/* Book 2: Reading */}
                <div className="bg-[#059669] text-white px-3 py-1.5 sm:py-2 rounded shadow-xs flex items-center justify-between border-b-2 border-emerald-800">
                  <span className="text-xs sm:text-sm font-bold tracking-wide">
                    Reading
                  </span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                    B9
                  </span>
                </div>

                {/* Book 3: Writing */}
                <div className="bg-[#4F46E5] text-white px-3 py-1.5 sm:py-2 rounded shadow-xs flex items-center justify-between border-b-2 border-indigo-900">
                  <span className="text-xs sm:text-sm font-bold tracking-wide">
                    Writing
                  </span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                    B9
                  </span>
                </div>

                {/* Book 4: Speaking */}
                <div className="bg-[#E11D48] text-white px-3 py-1.5 sm:py-2 rounded-b-lg shadow-sm flex items-center justify-between border-b-2 border-rose-800">
                  <span className="text-xs sm:text-sm font-bold tracking-wide">
                    Speaking
                  </span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                    B9
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
