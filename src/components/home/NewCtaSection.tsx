"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";

export default function NewCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scriptRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      if (scriptRef.current) {
        gsap.fromTo(
          scriptRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.4)",
            clearProps: "all",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      if (planeRef.current) {
        gsap.fromTo(
          planeRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "opacity",
            scrollTrigger: {
              trigger: sectionRef.current,
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
      className="relative bg-[#071026] text-white overflow-hidden py-14 sm:py-20"
    >
      {/* Background Night City Silhouette Overlay at Bottom Right */}
      <div
        className="absolute inset-0 bg-cover bg-bottom opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop')",
        }}
      />

      {/* Aerobatic Flight Loop & Airplane on the Right Side Only */}
      <div className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 md:w-[480px] lg:w-[560px] pointer-events-none hidden sm:block overflow-visible select-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 560 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Loop-de-loop flight path */}
          <path
            d="M 20 200 C 80 190, 160 140, 230 90 C 265 50, 320 25, 360 55 C 400 85, 395 155, 355 175 C 315 195, 280 165, 295 120 C 310 75, 390 40, 485 30"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* Golden Airplane connected directly to the tip of the flight trail */}
          <g ref={planeRef} transform="translate(480, 6) scale(1.25)">
            <path
              d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
              fill="#F59E0B"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Playful Handwritten Script */}
          <div className="md:col-span-4 flex items-center justify-center md:justify-start">
            <div
              ref={scriptRef}
              className="text-center md:text-left -rotate-6 select-none"
            >
              <span className="font-handwriting text-3xl sm:text-5xl font-bold text-white tracking-wide block drop-shadow-sm">
                Let&apos;s make it happen!
              </span>
              <span className="font-handwriting text-3xl sm:text-4xl text-amber-400 font-bold block pt-1">
                ♡
              </span>
            </div>
          </div>

          {/* Right: Headline, Subtitle and Contact Button */}
          <div
            ref={contentRef}
            className="md:col-span-8 space-y-3 sm:space-y-4 text-center md:text-left md:pl-6"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Ready to start your journey?
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-xl leading-relaxed mx-auto md:mx-0">
              Get in touch today for personalized advice and take the first step
              towards your international education.
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-6 py-2.5 sm:px-7 sm:py-3 rounded-full text-sm sm:text-base transition-all duration-200 shadow-sm hover:gap-3 cursor-pointer"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
