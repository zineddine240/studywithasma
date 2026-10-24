import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailPageContent from "@/components/courses/CourseDetailPageContent";
import { getCourseBySlug } from "@/lib/courseData";

export const metadata: Metadata = {
  title: "General IELTS - Study with Asma",
  description:
    "Prepare for work, migration, and everyday English communication through practical IELTS training with Asma.",
};

export default async function GeneralIeltsPage() {
  const course = await getCourseBySlug("general-ielts");
  if (!course) return notFound();

  return <CourseDetailPageContent course={course} />;
}
