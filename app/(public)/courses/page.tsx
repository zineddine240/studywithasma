import { getAllCourses } from "@/lib/courseData";
import type { Metadata } from "next";
import CoursesPageClient from "./CoursesPageClient";

export const metadata: Metadata = {
  title: "Courses - Study with Asma",
  description:
    "Prepare for IELTS with structured lessons, live classes, recorded sessions, and personal guidance from Asma.",
};

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return <CoursesPageClient courses={courses} />;
}

