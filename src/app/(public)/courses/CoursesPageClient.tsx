"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Video,
  Users,
  FileText,
  Target,
  ShieldCheck,
} from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import type { CourseSummary } from "@/lib/courseData";
import SectionTag from "@/components/ui/section-tag";
import NewCtaSection from "@/components/home/NewCtaSection";

const features = [
  {
    title: "Live Masterclasses",
    desc: "Interactive weekly sessions covering advanced strategies for all 4 modules.",
    icon: Video,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-100",
  },
  {
    title: "Personalized Grading",
    desc: "Detailed, line-by-line feedback on your writing tasks and speaking recordings.",
    icon: Target,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
  },
  {
    title: "Video Library",
    desc: "On-demand access to a growing library of high-definition lesson recordings.",
    icon: BookOpen,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-100",
  },
  {
    title: "Mock Exams",
    desc: "Full-length practice tests designed to simulate real exam conditions.",
    icon: FileText,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
  },
  {
    title: "Study Resources",
    desc: "Exclusive PDF workbooks, vocabulary lists, and grammar guides.",
    icon: ShieldCheck,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
  },
  {
    title: "Private Community",
    desc: "Direct access to Asma and fellow students for daily Q&A and support.",
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-100",
  },
];

export default function CoursesPageClient({
  courses,
}: {
  courses: CourseSummary[];
}) {
  return (
    <main className="grow bg-white">
      {/* ── Dynamic Hero Section ── */}
      <section className="pt-10 sm:pt-14 pb-14 sm:pb-20 bg-[#FAFAFC] border-b border-slate-100 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <SectionTag>WORLD-CLASS CURRICULUM</SectionTag>
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0B1536] tracking-tight leading-[1.12]">
              Choose Your Path to IELTS Success
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Prepare with structured lessons, live interactive masterclasses,
              recorded sessions, and personal feedback directly from senior
              trainer Asma.
            </p>

            <div className="pt-2 select-none -rotate-1">
              <span className="font-handwriting text-2xl sm:text-3xl font-bold text-indigo-700">
                Study smart, score high ♡
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Feature Grid (Bento) ── */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
            <SectionTag>INCLUDED IN YOUR ENROLLMENT</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              Everything Included in Your Track
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to master Academic or General IELTS and reach
              Band 7.5+.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.bg} border flex items-center justify-center mb-5`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course Cards ── */}
      <section className="py-14 sm:py-20 bg-[#FAFAFC] border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
            <SectionTag>SELECT YOUR TRACK</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              IELTS Courses
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Find the perfect track for your immigration or academic goals.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Courses Coming Soon
              </h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Our curriculum is being finalized. Request access to get
                notified the moment we launch the next cohort.
              </p>
              <Link
                href="/request-access"
                className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-7 py-3 rounded-full text-sm shadow-xs transition-colors"
              >
                <span>Request Access</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {courses.map((course) => (
                <div key={course.id}>
                  <CourseCard {...course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Closing CTA Banner ── */}
      <NewCtaSection />
    </main>
  );
}
