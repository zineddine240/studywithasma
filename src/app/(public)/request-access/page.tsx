"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import RequestAccessForm from "@/components/forms/RequestAccessForm";
import SectionTag from "@/components/ui/section-tag";

function RequestAccessContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course") ?? "";
  const validCourses = ["academic-ielts", "general-ielts"];
  const defaultCourse = validCourses.includes(courseParam) ? courseParam : "";

  return (
    <main className="grow bg-white">
      <section className="py-14 sm:py-20 bg-[#FAFAFC] relative overflow-hidden border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            {/* ── Trust Reassurance Panel (Left) ── */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <SectionTag>COURSE ENROLLMENT</SectionTag>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight mb-3">
                  Request Course Access
                </h1>
                <p className="text-base text-slate-600 leading-relaxed">
                  Fill in the form to request enrollment. We will review your
                  request and get back to you with the next steps within 24
                  hours.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs relative">
                <div className="absolute -top-3 -right-3 text-6xl text-indigo-100 font-serif leading-none select-none">
                  &ldquo;
                </div>
                <p className="text-sm font-medium text-slate-800 italic mb-4 leading-relaxed">
                  &ldquo;I was hesitant to join another online course, but
                  Asma&apos;s personal feedback was exactly what I needed. Best
                  decision I made for my IELTS prep!&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                    <span className="text-amber-600 font-bold text-sm">
                      A.H.
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Ahmed H.</p>
                    <p className="text-xs text-slate-500">Band 8.0 Achiever</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 font-medium bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
                <svg
                  className="w-4 h-4 text-emerald-600 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>
                  Your information is 100% secure and will never be shared.
                </span>
              </div>
            </div>

            {/* ── Form Section (Right) ── */}
            <div className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
              <RequestAccessForm defaultCourse={defaultCourse} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function RequestAccessPage() {
  return (
    <Suspense>
      <RequestAccessContent />
    </Suspense>
  );
}
