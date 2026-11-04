"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, GraduationCap, Heart, Users } from "lucide-react";

export default function NewHeroSection() {
  return (
    <section className="relative bg-[#FAFAFC] pt-6 sm:pt-10 pb-10 sm:pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Split: Text & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Text & CTA */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-600">
              STUDY ABROAD
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0B1536] tracking-tight leading-[1.12]">
              Your Future, Our Guidance
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg">
              Explore top universities in France and Italy. Get the right
              information, expert guidance, and support at every step of your
              study abroad journey.
            </p>

            <div className="pt-2">
              <Link
                href="#destinations"
                className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-7 py-3.5 rounded-full text-base transition-all duration-200 shadow-xs hover:gap-3 cursor-pointer"
              >
                <span>Explore Destinations</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Right: Visual of European historic cathedral & female student */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format&fit=crop"
                alt="Student looking over European historic city"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_35%]"
              />

              {/* Soft warm sun glow overlay */}
              <div className="absolute inset-0 bg-linear-to-tr from-amber-500/10 via-transparent to-indigo-900/10 pointer-events-none" />

              {/* Handwritten note in the upper sky */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-xl shadow-xs -rotate-3 border border-indigo-100/60 select-none">
                <p className="font-handwriting text-2xl sm:text-3xl font-bold text-[#1E255E] leading-tight text-center">
                  Big dreams<br />Real opportunities <span className="text-indigo-600">♡</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Key Pillars Bar (Value Props) */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
    </section>
  );
}
