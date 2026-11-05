"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Minus,
  Award,
  Users2,
} from "lucide-react";
import SectionTag from "@/components/ui/section-tag";
import NewCtaSection from "@/components/home/NewCtaSection";

const STATS = [
  {
    number: "Band 7.5+",
    label: "Average Student Score",
    icon: Award,
    circleBg: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    number: "1000+",
    label: "Students Placed Abroad",
    icon: Users2,
    circleBg: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
];


const TABS_CONTENT = {
  mission: {
    title: "Our Mission: Empowering Your Educational Journey",
    paragraphs: [
      "At Study With Asma, our mission is to empower students in their pursuit of European higher education. We provide structured IELTS preparation, university matching, and visa guidance so every student feels confident and well-prepared.",
      "We believe that language proficiency and transparent admissions counseling open doors to futures without borders. By focusing exclusively on France and Italy, we offer deep local expertise and verified scholarship pathways.",
    ],
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  },
  vision: {
    title: "Our Vision: Global Education Without Barriers",
    paragraphs: [
      "We envision a future where talented students effortlessly access top-tier European universities, funded by merit and regional scholarships rather than financial burden.",
      "By combining rigorous British Council standards with localized mentorship, we eliminate the uncertainty and stress of international applications.",
    ],
    image:
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=800&auto=format&fit=crop",
  },
  goals: {
    title: "Our Goals: Academic & Professional Excellence",
    paragraphs: [
      "To ensure every student reaches at least IELTS Band 7.0+ through targeted diagnostic feedback on writing and speaking.",
      "To maximize scholarship acceptance rates for English-taught Master's programs across French Grandes Écoles and Italian state universities.",
    ],
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
  },
};

const ABOUT_FAQS = [
  {
    question: "What services does Study with Asma provide?",
    answer:
      "We provide comprehensive IELTS Academic & General Training courses alongside dedicated study-abroad consulting for France and Italy, including university matching, dossier drafting, DSU scholarships, and visa guidance.",
  },
  {
    question: "Do you assist with visa processing and interviews?",
    answer:
      "Yes. We offer 1-on-1 mock interviews and thorough dossier validation for Campus France, TLScontact, and VFS Global appointments.",
  },
  {
    question: "Which countries do you cover for study abroad?",
    answer:
      "We specialize exclusively in France and Italy to ensure the highest degree of expertise, scholarship success, and personalized attention.",
  },
  {
    question: "Can I study in France or Italy in English?",
    answer:
      "Yes. Both France and Italy offer hundreds of accredited Bachelor's and Master's programs taught entirely in English, requiring only an IELTS or equivalent English certification.",
  },
  {
    question: "How do DSU scholarships in Italy work?",
    answer:
      "DSU (Diritto allo Studio Universitario) are regional need-based scholarships in Italy providing full tuition fee waivers, free university canteen meals, and yearly cash stipends up to €7,000.",
  },
];

export default function AboutPageClient() {
  const [activeTab, setActiveTab] = useState<"mission" | "vision" | "goals">(
    "mission"
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const currentTab = TABS_CONTENT[activeTab];

  return (
    <main className="grow bg-white">
      {/* ── 1. Hero Header & Mosaic Gallery ── */}
      <section className="pt-10 sm:pt-14 pb-14 sm:pb-20 bg-[#FAFAFC] border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Headline & Brief Intro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-end mb-10 sm:mb-14">
            <div className="lg:col-span-7 space-y-3">
              <SectionTag>ABOUT ASMA</SectionTag>
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0B1536] tracking-tight leading-[1.12]">
                Guiding Ambitious Students to Europe
              </h1>
            </div>
            <div className="lg:col-span-5 relative">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                At Study With Asma, we are dedicated to shaping brighter futures
                by delivering expert IELTS guidance and unmatched admissions
                support for top universities in France and Italy.
              </p>
              {/* Handwritten script note */}
              <div className="pt-2 select-none -rotate-2">
                <span className="font-handwriting text-2xl sm:text-3xl font-bold text-indigo-700">
                  Every student deserves a world-class education ♡
                </span>
              </div>
            </div>
          </div>

          {/* 4-Photo Mosaic Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Tall Photo (7 cols) */}
            <div className="md:col-span-7 relative aspect-4/3 md:aspect-auto md:h-full min-h-[300px] sm:min-h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
                alt="Students studying together on campus"
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Right Stacked Photos (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6">
              {/* Top Wide Photo */}
              <div className="relative aspect-16/9 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop"
                  alt="Student in European university library"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              {/* Bottom Two Photos Side-by-Side */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500&auto=format&fit=crop"
                    alt="Campus discussion"
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100">
                  <Image
                    src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=500&auto=format&fit=crop"
                    alt="Graduation celebration"
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── 3. Why Choose Us / Trust Badges ── */}
      <section className="py-14 sm:py-20 bg-[#FAFAFC] border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="max-w-2xl mb-10 sm:mb-12 space-y-2">
            <SectionTag>WHY CHOOSE US</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              A Proven Track Record of Success
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We combine pedagogical discipline with thorough embassy and
              university procedural mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.number}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-3"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${stat.circleBg} border flex items-center justify-center transition-transform hover:scale-105`}
                  >
                    <Icon className="w-7 h-7 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Mission / Vision Section (Modern Clean Bento with Tabs) ── */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
            <SectionTag>OUR CORE PURPOSE</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              Mission, Vision &amp; Goals
            </h2>
          </div>

          {/* Top Pill Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            <button
              type="button"
              onClick={() => setActiveTab("mission")}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "mission"
                  ? "bg-[#F59E0B] text-slate-950 shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Our Mission
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("vision")}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "vision"
                  ? "bg-[#F59E0B] text-slate-950 shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Our Vision
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("goals")}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "goals"
                  ? "bg-[#F59E0B] text-slate-950 shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Our Goals
            </button>
          </div>

          {/* Clean Bento Card */}
          <div className="bg-[#FAFAFC] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Photo */}
              <div className="lg:col-span-5 relative aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-200">
                <Image
                  src={currentTab.image}
                  alt={currentTab.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              {/* Right Content */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0B1536] leading-snug">
                  {currentTab.title}
                </h3>
                {currentTab.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-xs sm:text-sm text-slate-600 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. About FAQ ── */}
      <section className="py-14 sm:py-20 bg-[#FAFAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-2 mb-10 sm:mb-12">
              <SectionTag>FAQ</SectionTag>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {ABOUT_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-indigo-200 shadow-sm ring-1 ring-indigo-50"
                        : "border-slate-200/80 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? null : index)
                      }
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-hidden"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                      <span
                        className={`p-1.5 rounded-full shrink-0 transition-colors ${
                          isOpen
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                        <p className="pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Closing CTA Banner ── */}
      <NewCtaSection />
    </main>
  );
}
