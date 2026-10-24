import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import ServicePathwaysSection from "@/components/home/ServicePathwaysSection";
import AboutAsmaSection from "@/components/home/AboutAsmaSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import FounderQuoteSection from "@/components/home/FounderQuoteSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import FeaturedResourcesSection from "@/components/home/FeaturedResourcesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import ConversionCtaSection from "@/components/home/ConversionCtaSection";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Study With Asma | IELTS Preparation & Study Abroad in France & Italy",
  description:
    "Master IELTS Academic & General with senior trainer Asma, and explore international study and scholarship opportunities in France and Italy.",
};

async function TestimonialsStreamed() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return <TestimonialsSection testimonials={testimonials || []} />;
}

export default function Home() {
  return (
    <main className="grow">
      {/* 1. Hero Section with Orbital Constellation & Search Bar */}
      <HeroSection />

      {/* 2. Services Grid (6 Soft Cards) */}
      <ServicePathwaysSection />

      {/* 3. Royal Blue Impact Section (About Us) */}
      <AboutAsmaSection />

      {/* 4. 5-Stage Alternating Working Process Timeline */}
      <HowItWorksSection />

      {/* 5. Top Destinations (France & Italy) */}
      <DestinationsSection />

      {/* 6. Founder Quote Banner */}
      <FounderQuoteSection />

      {/* 7. Why Choose Us (4 Circular Stat Badges) */}
      <WhyChooseUsSection />

      {/* 8. Insights & Resources (Porbe-Style Blog) */}
      <FeaturedResourcesSection />

      {/* 9. Testimonials (Streamed asynchronously via Suspense to eliminate server blocking) */}
      <Suspense fallback={null}>
        <TestimonialsStreamed />
      </Suspense>

      {/* 10. Frequently Asked Questions (2-Column Grid) */}
      <FaqSection />

      {/* 11. Final Closing Conversion Banner */}
      <ConversionCtaSection />
    </main>
  );
}
