"use client";

import Link from "next/link";
import { BookOpen, Headphones, PenTool, Mic, ArrowRight } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import type { CourseSummary } from "@/lib/courseData";
import SectionTag from "@/components/ui/section-tag";
import NewCtaSection from "@/components/home/NewCtaSection";

interface IeltsPageClientProps {
  courses: CourseSummary[];
}

const SKILLS = [
  {
    icon: Headphones,
    title: "Listening Comprehension",
    desc: "Master accent variations (British, Australian, North American), predict answers, and tackle fast Section 3 & 4 academic discussions.",
    criteria: "Focus: Distractor identification & spelling accuracy",
    color: "text-sky-600",
    bg: "bg-sky-50 border-sky-100",
  },
  {
    icon: BookOpen,
    title: "Reading Strategies",
    desc: "Eliminate time pressure using speed skimming, targeted scanning, and precise True/False/Not Given and Headings verification.",
    criteria: "Focus: Paraphrasing recognition & time allocation",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
  },
  {
    icon: PenTool,
    title: "Writing Mastery (Task 1 & 2)",
    desc: "Learn paragraph development, formal register, complex sentence structures, and data analysis templates that hit Band 7.5+.",
    criteria: "Focus: Task achievement, cohesion & lexical accuracy",
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-100",
  },
  {
    icon: Mic,
    title: "Speaking Fluency",
    desc: "Build natural conversational confidence for Part 1, structured 2-minute Part 2 monologues, and in-depth Part 3 abstract discussions.",
    criteria: "Focus: Discourse markers, pronunciation & idiomatic flow",
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-100",
  },
];

export default function IeltsPageClient({ courses }: IeltsPageClientProps) {
  return (
    <main className="grow bg-white">
      {/* ── Page Hero ── */}
      <section className="pt-10 sm:pt-14 pb-14 sm:pb-20 bg-[#FAFAFC] border-b border-slate-100 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <SectionTag>IELTS PREPARATION</SectionTag>
          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0B1536] tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Master IELTS with Precision &amp; Personal Feedback
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Personalized guidance, weekly live interactive masterclasses,
            recorded lesson archives, and detailed examiner-level essay grading
            from senior trainer Asma.
          </p>

          <div className="pt-2 select-none -rotate-1">
            <span className="font-handwriting text-2xl sm:text-3xl font-bold text-indigo-700">
              Your target band is within reach ♡
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/request-access"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm shadow-xs transition-colors"
            >
              <span>Enroll / Request Access</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link
              href="/level-test"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 px-7 py-3.5 rounded-full font-bold text-sm transition-colors shadow-2xs"
            >
              <span>Free 15-Min Diagnostic Test</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── The 4 Core Skills Breakdown ── */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
            <SectionTag>THE 4 MODULES</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              Mastering the Four IELTS Modules
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Examiners evaluate very specific descriptors. We train you to meet
              each band metric methodically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKILLS.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl ${skill.bg} border flex items-center justify-center mb-4`}
                    >
                      <Icon className={`w-6 h-6 ${skill.color}`} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                      {skill.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                      {skill.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-indigo-600">
                      {skill.criteria}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Course Catalog Cards ── */}
      <section className="py-14 sm:py-20 bg-[#FAFAFC] border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
            <SectionTag>AVAILABLE COURSES</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              Select Your Course
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Choose your program and submit an access request to join the next
              intake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-slate-500 text-sm">
                Course cohorts are currently being finalized. Please request
                access or contact Asma directly.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <NewCtaSection />
    </main>
  );
}
