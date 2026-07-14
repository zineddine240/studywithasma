import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CourseCard, { getCoursesData } from "@/components/courses/CourseCard";

export const metadata: Metadata = {
  title: "Courses — Study with Asma",
  description:
    "Choose your IELTS course. Prepare for Academic or General IELTS with structured lessons, live classes, recorded sessions, and personal guidance.",
};

export default function CoursesPage() {
  const courses = getCoursesData();

  return (
    <main className="flex-grow">
      {/* Page Header */}
      <section className="bg-[#FAF7FF] py-16 sm:py-20 border-b border-[#EDE9FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E1B4B] mb-5 tracking-tight">
            Choose Your IELTS Course
          </h1>
          <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Prepare for IELTS with structured lessons, live classes, recorded
            sessions, and personal guidance from Asma.
          </p>
        </div>
      </section>

      {/* Course Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 bg-[#7C3AED]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-8 leading-tight">
            Ready to Start Your IELTS Journey?
          </h2>
          <Link
            href="#signup"
            className="inline-flex items-center gap-2 bg-white text-[#7C3AED] px-10 py-4 rounded-full text-lg font-bold hover:bg-[#FAF7FF] transition-colors shadow-xl"
          >
            Create Your Student Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
