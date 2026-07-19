import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { getAllCourses } from "@/lib/courseData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses - Study with Asma",
  description:
    "Prepare for IELTS with structured lessons, live classes, recorded sessions, and personal guidance from Asma.",
};

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <main className="grow">
      {/* ── Page Header ── */}
      <section className="bg-muted/30 py-16 sm:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Choose Your IELTS Course
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Prepare for IELTS with structured lessons, live classes, recorded
            sessions, and personal guidance from Asma.
          </p>
        </div>
      </section>

      {/* ── Course Cards ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Courses Coming Soon
              </h2>
              <p className="text-muted-foreground max-w-sm mb-6">
                Our course catalogue is being prepared. Check back soon or
                request access to get notified.
              </p>
              <Link
                href="/request-access"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Request Access
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
              {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      {courses.length > 0 && (
        <section className="py-16 sm:py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Ready to Start Your IELTS Journey?
            </h2>
            <Link
              href="/request-access"
              className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-muted/30 transition-colors"
            >
              Create Your Student Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

