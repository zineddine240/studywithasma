import { getAllCourses } from "@/lib/courseData";
import IeltsPageClient from "./IeltsPageClient";

export const metadata = {
  title: "IELTS Preparation | Academic & General Training | Study With Asma",
  description:
    "Structured online IELTS preparation led by senior trainer Asma. Live classes, recorded lessons, personalized writing evaluations, and exam-proven strategies.",
};

export default async function IeltsPage() {
  const courses = await getAllCourses();

  return <IeltsPageClient courses={courses} />;
}
