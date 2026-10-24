"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Sparkles } from "lucide-react";
import DestinationCard from "@/components/destinations/DestinationCard";
import { getAllDestinations } from "@/lib/destinationData";
import { SectionTag } from "@/components/ui/section-tag";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";

export default function DestinationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const destinations = getAllDestinations();

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const cards = cardsContainerRef.current?.children;
      if (!cards) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-background relative overflow-hidden"
      id="destinations"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-2xl text-left">
            <SectionTag>TOP DESTINATIONS</SectionTag>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-foreground tracking-tight">
              Discover Your Ideal Study Destination
            </h2>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors shrink-0 group self-start md:self-end"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Destination Cards List */}
        <div ref={cardsContainerRef} className="space-y-6">
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA to view destinations */}
        <div className="text-center pt-10">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-bold text-sm hover:bg-secondary/80 border border-border transition-all"
          >
            <span>Explore France &amp; Italy Study Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
