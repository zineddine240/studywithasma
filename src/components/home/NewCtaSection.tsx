"use client";

import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";

export default function NewCtaSection() {
  return (
    <section className="relative bg-[#071026] text-white overflow-hidden py-14 sm:py-20">
      {/* Background Night City Silhouette Overlay at Bottom Right */}
      <div
        className="absolute inset-0 bg-cover bg-bottom opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop')",
        }}
      />

      {/* Swooping Golden Dashed Flight Path with Airplane */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 100 240 Q 600 280 1100 80"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      </svg>
      <div className="absolute top-14 right-12 sm:right-24 hidden md:block text-[#F59E0B] rotate-12 pointer-events-none">
        <Plane className="w-6 h-6 fill-[#F59E0B]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Playful Handwritten Script */}
          <div className="md:col-span-4 flex items-center justify-center md:justify-start">
            <div className="text-center md:text-left -rotate-6 select-none">
              <span className="font-handwriting text-3xl sm:text-5xl font-bold text-white tracking-wide block drop-shadow-sm">
                Let&apos;s make it happen!
              </span>
              <span className="font-handwriting text-3xl sm:text-4xl text-amber-400 font-bold block pt-1">
                ♡
              </span>
            </div>
          </div>

          {/* Right: Headline, Subtitle and Contact Button */}
          <div className="md:col-span-8 space-y-3 sm:space-y-4 text-center md:text-left md:pl-6">
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

