"use client";

import Link from "next/link";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Video,
  FileCheck,
  Target,
} from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import type { CourseSummary } from "@/lib/courseData";
import SectionTag from "@/components/ui/section-tag";

interface IeltsPageClientProps {
  courses: CourseSummary[];
}

const SKILLS = [
  {
    icon: Headphones,
    title: "Listening Comprehension",
    desc: "Master accent variations (British, Australian, North American), predict answers, and tackle fast Section 3 & 4 academic discussions.",
    criteria: "Focus: Distractor identification & spelling accuracy",
  },
  {
    icon: BookOpen,
    title: "Reading Strategies",
    desc: "Eliminate time pressure using speed skimming, targeted scanning, and precise True/False/Not Given and Headings verification.",
    criteria: "Focus: Paraphrasing recognition & time allocation",
  },
  {
    icon: PenTool,
    title: "Writing Mastery (Task 1 & 2)",
    desc: "Learn paragraph development, formal register, complex sentence structures, and data analysis templates that hit Band 7.5+.",
    criteria: "Focus: Task achievement, cohesion & lexical accuracy",
  },
  {
    icon: Mic,
    title: "Speaking Fluency",
    desc: "Build natural conversational confidence for Part 1, structured 2-minute Part 2 monologues, and in-depth Part 3 abstract discussions.",
    criteria: "Focus: Discourse markers, pronunciation & idiomatic flow",
  },
];

export default function IeltsPageClient({ courses }: IeltsPageClientProps) {
  return (
    <main className="grow bg-background">
      {/* ── Page Hero ── */}
      <section className="py-16 sm:py-24 bg-linear-to-b from-secondary/40 via-background to-background border-b border-border relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  text-center space-y-6">
          <SectionTag>IELTS PREPARATION</SectionTag>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
            Master IELTS with Precision &amp;{" "}
            <br className="hidden sm:inline" />
            <span className="text-primary">Examiner-Level Insights</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Personalized guidance, weekly live interactive masterclasses,
            recorded lesson archives, and detailed essay grading from senior
            trainer Asma.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/request-access"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold text-sm hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
            >
              <span>Enroll / Request Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/level-test"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card text-foreground border border-border px-8 py-3.5 rounded-full font-bold text-sm hover:bg-secondary transition-colors"
            >
              <span>Free 15-Min Diagnostic Test</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── The 4 Core Skills Breakdown ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Mastering the Four IELTS Modules
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Examiners evaluate very specific descriptors. We train you to meet
              each band metric methodically.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILLS.map((skill) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.title}
                  className="bg-card rounded-3xl border border-border p-6 space-y-4 hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground">
                      {skill.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {skill.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/80 text-[11px] font-bold text-primary">
                    {skill.criteria}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Academic vs General Comparison ── */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                Academic vs. General Training: Which Track?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Choose the exact track required for your university admission or
                immigration pathway.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Academic Card */}
              <div className="bg-card rounded-3xl border-2 border-primary/30 p-8 space-y-6 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Higher Education &amp; University Admissions
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">
                  IELTS Academic
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Designed for students planning to enroll in undergraduate,
                  Master's, or doctoral programs taught in English globally.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Task 1: Describe graphs, charts, maps, or processes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Task 2: Formal argumentative or discussion essay
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Reading: Academic journals, scientific texts, and reports
                    </span>
                  </li>
                </ul>
                <Link
                  href="/courses/academic-ielts"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  <span>View Academic Course Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* General Card */}
              <div className="bg-card rounded-3xl border border-border p-8 space-y-6 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
                  Work, Training &amp; Express Entry Migration
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">
                  IELTS General Training
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Designed for working professionals applying for skilled
                  migration (e.g. Canada Express Entry) or workplace
                  registration.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Task 1: Formal, semi-formal, or personal letters
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Task 2: General social topic essay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Reading: Work manuals, advertisements, and social texts
                    </span>
                  </li>
                </ul>
                <Link
                  href="/courses/general-ielts"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  <span>View General Training Course Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Course Catalog Cards ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Select Your Course
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Choose your program and submit an access request to join the next
              intake.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                Course cohorts are currently being finalized. Please request
                access or contact Asma directly.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="py-20 bg-background relative overflow-hidden text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="relative bg-[#183ce4] rounded-3xl sm:rounded-4xl p-10 sm:p-16 lg:p-20 text-white text-center shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
                Not sure what score you need for your target country?
              </h2>
              <p className="text-base text-white/90 max-w-xl mx-auto leading-relaxed">
                Take our free diagnostic assessment or schedule a consultation
                with Asma to establish an exact preparation plan.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/level-test"
                  className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg shadow-amber-400/20 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                >
                  <span>Take Free Diagnostic Test</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3.5 rounded-full font-bold text-sm transition-colors"
                >
                  <span>Book a Consultation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
