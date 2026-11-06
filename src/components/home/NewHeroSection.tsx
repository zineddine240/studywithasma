"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, GraduationCap, Heart, Users } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";

export default function NewHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const skyScriptRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (heroContentRef.current) {
        tl.fromTo(
          heroContentRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            clearProps: "all",
          },
        );
      }

      if (skyScriptRef.current) {
        tl.fromTo(
          skyScriptRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.4)",
            clearProps: "all",
          },
          "-=0.3",
        );
      }

      if (pillarsRef.current) {
        tl.fromTo(
          pillarsRef.current.children,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            clearProps: "all",
          },
          "-=0.2",
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white"
    >
      {/* ── Full Screen Hero Visual & Text ── */}
      <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden">
        {/* Full-bleed background image covering the entire hero */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero-study-abroad-panoramic.jpg"
            alt="European historic cathedral dome with female student looking at the city"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[75%_25%] sm:object-[center_35%]"
          />

          {/* Subtle horizontal gradient wash: ensures dark blue typography is crisp & readable on the left while keeping Rome panoramic cityscape luminous and vivid */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent/5 sm:from-white/85 sm:via-white/30 sm:to-transparent pointer-events-none" />

          {/* Soft warm sun glow */}
          <div className="absolute inset-0 bg-linear-to-tr from-amber-500/10 via-transparent to-indigo-900/10 pointer-events-none" />
        </div>

        {/* Main Hero Content (Left text + Right handwritten script in the open sky) */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
            {/* Left Column: Heading, Subtitle & Button */}
            <div
              ref={heroContentRef}
              className="lg:col-span-7 space-y-5 sm:space-y-6 max-w-xl pt-2 sm:pt-4"
            >
              <div>
                <SectionTag>
                  <span className="uppercase font-bold tracking-wider">
                    STUDY ABROAD
                  </span>
                </SectionTag>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0B1536] tracking-tight leading-[1.12]">
                Your Future, Our Guidance
              </h1>

              <p className="text-slate-800 text-base sm:text-lg leading-relaxed max-w-lg font-medium">
                Explore top universities in France and Italy. Get the right
                information, expert guidance, and support at every step of your
                study abroad journey.
              </p>

              <div className="pt-2">
                <Link
                  href="#destinations"
                  className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-7 py-3.5 rounded-full text-base transition-all duration-200 shadow-sm hover:gap-3 cursor-pointer"
                >
                  <span>Explore Destinations</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>

            {/* Right Column: Handwritten Cursive Script placed in the open sky */}
            <div className="lg:col-span-5 flex justify-end items-start pr-2 sm:pr-8 pt-0 sm:pt-2">
              <div
                ref={skyScriptRef}
                className="select-none -rotate-3 sm:-rotate-6 text-right"
              >
                <p className="font-handwriting text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E255E] leading-tight drop-shadow-xs">
                  Big dreams
                  <br />
                  Real opportunities <span className="text-indigo-600">♡</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Key Pillars Strip (Matching the Mockup Strip directly below hero) ── */}
      <div className="relative z-10 w-full bg-white border-y border-slate-200/80 shadow-2xs py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={pillarsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {/* Pillar 1 */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full border border-indigo-200 bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Trusted Information
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Up-to-date and reliable university and visa information.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full border border-indigo-200 bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Personalized Guidance
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tailored support based on your goals and profile.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full border border-indigo-200 bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Expert Support
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  From university selection to application submission.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full border border-indigo-200 bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Your Success
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We&apos;re with you, every step of the way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
