"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  Plus,
  Minus,
  Award,
  CheckCircle2,
  Users2,
  GraduationCap,
} from "lucide-react";
import SectionTag from "@/components/ui/section-tag";

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

const MILESTONES = [
  {
    year: "2016",
    title: "Founded in Algiers",
    desc: "Began dedicated IELTS exam training with personalized writing and speaking evaluations.",
  },
  {
    year: "2020",
    title: "Expanding to France & Italy",
    desc: "Added comprehensive university admissions and Campus France and Universitaly advisory.",
  },
  {
    year: "2024",
    title: "Leading Study Platform",
    desc: "Over 500 successful admissions and full DSU scholarships secured for Algerian students.",
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
      "We envision a future where talented Algerian students effortlessly access top-tier European universities, funded by merit and regional scholarships rather than financial burden.",
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
      "Yes. We offer 1-on-1 mock interviews and thorough dossier validation for Campus France, TLScontact, and VFS Global embassy appointments.",
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
    "mission",
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const currentTab = TABS_CONTENT[activeTab];

  return (
    <main className="grow bg-background">
      {/* ── 1. Hero Header & 4-Photo Mosaic Gallery (Porbe Layout) ── */}
      <section className="pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          {/* Headline & Brief Intro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 sm:mb-16">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-foreground tracking-tight leading-[1.1]">
                Shaping Futures Through Study Abroad Excellence
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                At Study With Asma, we are dedicated to shaping brighter futures
                by delivering expert IELTS guidance and unmatched admissions
                support for France and Italy.
              </p>
            </div>
          </div>

          {/* 4-Photo Mosaic Gallery (Matching Porbe's exact layout) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Tall Photo (7 cols) */}
            <div className="md:col-span-7 relative aspect-4/3 md:aspect-auto md:h-full min-h-[320px] rounded-3xl overflow-hidden shadow-xl border border-border">
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
              <div className="relative aspect-16/9 rounded-3xl overflow-hidden shadow-md border border-border">
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
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-border">
                  <Image
                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=500&auto=format&fit=crop"
                    alt="Study materials"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-border">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop"
                    alt="Asma, Mentor"
                    fill
                    sizes="200px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Milestones / Timeline Row (Porbe 3-Column Layout with Up-Arrows) ── */}
      <section className="py-20 lg:py-28 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
            {MILESTONES.map((item) => (
              <div
                key={item.year}
                className="space-y-4 flex flex-col items-center"
              >
                {/* Upward Arrow */}
                <div className="w-8 h-8 flex items-center justify-center text-primary">
                  <ArrowUp className="w-5 h-5" />
                </div>

                {/* Big Year Number */}
                <div className="text-3xl sm:text-4xl font-serif font-extrabold text-foreground">
                  {item.year}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-serif font-bold text-foreground">
                  {item.title}
                </h3>

                {/* Concise Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Why Choose Us (Porbe 4 Circular Badges) ── */}
      <section className="py-20 lg:py-28 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  text-center">
          <div className="max-w-2xl mx-auto space-y-3 mb-16 sm:mb-20">
            <SectionTag>WHY US</SectionTag>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-foreground tracking-tight">
              Why Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.number}
                  className="flex flex-col items-center text-center space-y-4 group"
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${stat.circleBg} flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-9 h-9 sm:w-11 sm:h-11" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-serif font-extrabold text-foreground">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Mission / Vision Section (Porbe Signature Royal Blue Block with Tabs) ── */}
      <section className="py-20 lg:py-28 bg-[#183ce4] text-white relative overflow-hidden">
        {/* Subtle radial lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  relative z-10">
          {/* Top Pill Tabs */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <button
              type="button"
              onClick={() => setActiveTab("mission")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === "mission"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              Our Mission
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("vision")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === "vision"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              Our Vision
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("goals")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === "goals"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              Our Goals
            </button>
          </div>

          {/* White Card inside Blue Block (Porbe Layout) */}
          <div className="bg-card text-foreground rounded-3xl sm:rounded-4xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Photo */}
              <div className="lg:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-border">
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
                <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-foreground leading-snug">
                  {currentTab.title}
                </h3>
                {currentTab.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Frequently Asked Questions (Porbe 1-Column Accordion on About) ── */}
      <section className="py-20 lg:py-28 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-3 mb-16 sm:mb-20">
              <SectionTag>FAQ</SectionTag>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-foreground tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {ABOUT_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className={`border rounded-2xl sm:rounded-3xl transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-primary/40 bg-card shadow-sm"
                        : "border-border/80 bg-card/60 hover:border-primary/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif font-bold text-sm sm:text-base text-foreground leading-snug">
                        {index + 1}. {faq.question}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3 animate-in fade-in-0 duration-150">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Closing Banner (Porbe Design) ── */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="relative bg-[#183ce4] rounded-3xl sm:rounded-4xl p-10 sm:p-16 lg:p-20 text-white text-center shadow-2xl overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            {/* Floating Circular Student Avatars */}
            <div className="hidden md:block absolute top-8 left-12 w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                alt="Student"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="hidden md:block absolute bottom-8 left-20 w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                alt="Student"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="hidden md:block absolute top-10 right-14 w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
                alt="Student"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="hidden md:block absolute bottom-10 right-16 w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
                alt="Student"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
                Are you prepared to soar and chase your dreams?
              </h2>

              <div className="pt-2 flex justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-4 rounded-full text-sm sm:text-base shadow-xl shadow-slate-950/20 hover:-translate-y-0.5 transition-all group"
                >
                  <span>Book a Consultation</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
