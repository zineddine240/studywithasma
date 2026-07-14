import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailPageContent from "@/components/courses/CourseDetailPageContent";
import { getCourseBySlug } from "@/lib/courseData";

export const metadata: Metadata = {
  title: "Academic IELTS — Study with Asma",
  description:
    "Prepare for university and academic purposes through structured IELTS lessons in Listening, Reading, Writing, and Speaking with Asma.",
};

export default function AcademicIeltsPage() {
  const course = getCourseBySlug("academic-ielts");
  if (!course) return notFound();

  return <CourseDetailPageContent course={course} />;
}
