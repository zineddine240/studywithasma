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
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const courses = await getCoursesWithModules();
  
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(10); // get the latest 10 published testimonials

  return (
    <main className="grow">
      <HeroSection />
      <StatsSection />
      <CoursesPreviewSection courses={courses} />
      <AboutSection />
      <WhyUsSection />
      <TestimonialsSection testimonials={testimonials || []} />
      <FaqSection />
      <LeadMagnetSection />
      <CtaSection />
    </main>
  );
}
