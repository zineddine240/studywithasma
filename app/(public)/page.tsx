import HeroSection from "@/components/home/HeroSection";
import CoursesPreviewSection from "@/components/home/CoursesPreviewSection";
import AboutSection from "@/components/home/AboutSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import CtaSection from "@/components/home/CtaSection";

export default function Home() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <CoursesPreviewSection />
      <AboutSection />
      <WhyUsSection />
      <CtaSection />
    </main>
  );
}
