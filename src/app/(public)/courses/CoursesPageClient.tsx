"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Video,
  Users,
  FileText,
  Target,
  ShieldCheck,
} from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import type { CourseSummary } from "@/lib/courseData";
import SectionTag from "@/components/ui/section-tag";

const features = [
  {
    title: "Live Masterclasses",
    desc: "Interactive weekly sessions covering advanced strategies for all 4 modules.",
    icon: Video,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Personalized Grading",
    desc: "Detailed, line-by-line feedback on your writing tasks and speaking recordings.",
    icon: Target,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Video Library",
    desc: "On-demand access to a growing library of high-definition lesson recordings.",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Mock Exams",
    desc: "Full-length practice tests designed to simulate real exam conditions.",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Study Resources",
    desc: "Exclusive PDF workbooks, vocabulary lists, and grammar guides.",
    icon: ShieldCheck,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Private Community",
    desc: "Direct access to Asma and fellow students for daily Q&A and support.",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export default function CoursesPageClient({
  courses,
}: {
  courses: CourseSummary[];
}) {
  return (
    <main className="grow bg-background">
      {/* ── Dynamic Hero Section ── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-muted/30 border-b border-border">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-1000" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-1000" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  text-center relative z-10">
          <div className="space-y-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionTag>WORLD-CLASS CURRICULUM</SectionTag>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-extrabold text-foreground tracking-tight max-w-4xl leading-tight">
              Choose Your Path to <br />
              <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                IELTS Success
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Prepare with structured lessons, live interactive masterclasses,
              recorded sessions, and personal feedback directly from a certified
              senior trainer.
            </p>
          </div>
        </div>
      </section>

      {/* ── Interactive Feature Grid (Bento) ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Everything Included in Your Enrollment
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl font-medium">
              Everything you need to master Academic or General IELTS and reach
              Band 7.5+.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-card border border-border p-8 rounded-3xl shadow-xs hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1 duration-300 cursor-default"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course Cards ── */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Select Your Course
            </h2>
            <p className="text-muted-foreground text-lg font-medium">
              Find the perfect track for your immigration or academic goals.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Courses Coming Soon
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Our curriculum is being finalized. Check back soon or request
                access to get notified the moment we launch.
              </p>
              <Link
                href="/request-access"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                Request Access
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
              {courses.map((course) => (
                <div key={course.id}>
                  <CourseCard {...course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      {courses.length > 0 && (
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
            <div className="relative bg-[#183ce4] rounded-3xl sm:rounded-4xl p-10 sm:p-16 lg:p-20 text-white text-center shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight">
                  Ready to Start Your IELTS Journey?
                </h2>
                <div className="pt-2 flex justify-center">
                  <Link
                    href="/request-access"
                    className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-9 py-4 rounded-full text-base sm:text-lg shadow-xl shadow-amber-400/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all group"
                  >
                    <span>Create Your Student Account</span>
                    <span className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
