import NewHeroSection from "@/components/home/NewHeroSection";
import NewDestinationsSection from "@/components/home/NewDestinationsSection";
import NewIeltsSection from "@/components/home/NewIeltsSection";
import NewServicesSection from "@/components/home/NewServicesSection";
import NewCtaSection from "@/components/home/NewCtaSection";

export const metadata = {
  title: "Study With Asma | Study Abroad Guidance & IELTS Preparation",
  description:
    "Explore top universities in France and Italy with expert guidance, and master IELTS with Asma's intensive live classes and personal feedback.",
};

export default function Home() {
  return (
    <main className="grow">
      {/* 1. Full Screen Hero Section & 4 Value Proposition Pillars */}
      <NewHeroSection />

      {/* 2. Choose Your Destination (France, Italy) */}
      <NewDestinationsSection />

      {/* 3. Master IELTS with Confidence (Desk Flatlay Visual) */}
      <NewIeltsSection />

      {/* 4. How We Can Help You (Our 5 Key Advisory Services) */}
      <NewServicesSection />

      {/* 5. Closing Conversion Banner: Ready to start your journey? */}
      <NewCtaSection />
    </main>
  );
}
