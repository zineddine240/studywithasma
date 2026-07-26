import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import CoursesPreviewSection from "@/components/home/CoursesPreviewSection";
import AboutSection from "@/components/home/AboutSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import LeadMagnetSection from "@/components/home/LeadMagnetSection";
import CtaSection from "@/components/home/CtaSection";
import { getCoursesWithModules } from "@/lib/courseData";

export default async function Home() {
  const courses = await getCoursesWithModules();

  return (
    <main className="grow">
      <HeroSection />
      <StatsSection />
      <CoursesPreviewSection courses={courses} />
      <AboutSection />
      <WhyUsSection />
      <TestimonialsSection />
      <FaqSection />
      <LeadMagnetSection />
      <CtaSection />
    </main>
  );
}
