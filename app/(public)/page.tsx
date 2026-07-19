import HeroSection from "@/components/home/HeroSection";
import CoursesPreviewSection from "@/components/home/CoursesPreviewSection";
import AboutSection from "@/components/home/AboutSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import CtaSection from "@/components/home/CtaSection";
import { getCoursesWithModules } from "@/lib/courseData";

export default async function Home() {
  const courses = await getCoursesWithModules();

  return (
    <main className="grow">
      <HeroSection />
      <CoursesPreviewSection courses={courses} />
      <AboutSection />
      <WhyUsSection />
      <CtaSection />
    </main>
  );
}

