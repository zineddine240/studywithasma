"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ClipboardList } from "lucide-react";
import RequestAccessForm from "@/components/forms/RequestAccessForm";

function RequestAccessContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course") ?? "";

  const validCourses = ["academic-ielts", "general-ielts"];
  const defaultCourse = validCourses.includes(courseParam) ? courseParam : "";

  return (
    <main className="flex-grow">
      {/* Page Header */}
      <section className="bg-[#FAF7FF] py-14 sm:py-18 border-b border-[#EDE9FE]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-[#EDE9FE] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-7 h-7 text-[#7C3AED]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] mb-4 tracking-tight">
            Request Course Access
          </h1>
          <p className="text-lg text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Fill in the form below to request enrollment in an IELTS course.
            We will review your request and contact you with the next steps.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#EDE9FE] shadow-sm p-6 sm:p-10">
            <RequestAccessForm defaultCourse={defaultCourse} />
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
