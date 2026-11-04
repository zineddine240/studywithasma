import NewHeroSection from "@/components/home/NewHeroSection";
import NewDestinationsSection from "@/components/home/NewDestinationsSection";
import NewIeltsSection from "@/components/home/NewIeltsSection";
import NewServicesSection from "@/components/home/NewServicesSection";
import NewCtaSection from "@/components/home/NewCtaSection";

export const metadata = {
  title: "Study With Asma | Study Abroad Guidance & IELTS Preparation",
  description:
    "Explore top universities in Italy, France, the Netherlands and Poland with expert guidance, and master IELTS with Asma's intensive preparation.",
};

export default function Home() {
  return (
    <main className="grow">
      {/* 1. Hero Section & Value Propositions Pillars */}
      <NewHeroSection />

      {/* 2. Choose Your Destination (Italy, France, Netherlands, Poland) */}
      <NewDestinationsSection />

      {/* 3. Master IELTS with Confidence */}
      <NewIeltsSection />

      {/* 4. How We Can Help You (Our 5 Key Services) */}
      <NewServicesSection />

      {/* 5. Closing Conversion Banner: Ready to start your journey? */}
      <NewCtaSection />
    </main>
  );
}
