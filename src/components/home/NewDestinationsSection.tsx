"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionTag } from "@/components/ui/section-tag";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import {
  FranceFlag,
  ItalyFlag,
  NetherlandsFlag,
  PolandFlag,
} from "@/components/home/hero/CountryFlags";

interface CountryCardData {
  title: string;
  slug: string;
  description: string;
  image: string;
  FlagComponent: React.FC<{ className?: string }>;
}

const COUNTRIES: CountryCardData[] = [
  {
    title: "Study in Italy",
    slug: "italy",
    description:
      "Top-ranked universities, a rich culture and affordable education options.",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop",
    FlagComponent: ItalyFlag,
  },
  {
    title: "Study in France",
    slug: "france",
    description:
      "Prestigious institutions, excellent programs and great career opportunities.",
    image:
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop",
    FlagComponent: FranceFlag,
  },
  {
    title: "Study in the Netherlands",
    slug: "netherlands",
    description:
      "International environment, English-taught programs and innovative education.",
    image:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=800&auto=format&fit=crop",
    FlagComponent: NetherlandsFlag,
  },
  {
    title: "Study in Poland",
    slug: "poland",
    description:
      "Quality education, low tuition fees and a welcoming student community.",
    image:
      "https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=800&auto=format&fit=crop",
    FlagComponent: PolandFlag,
  },
];

export default function NewDestinationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      if (cardsContainerRef.current) {
        gsap.fromTo(
          cardsContainerRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 95%",
              once: true,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="py-14 sm:py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="space-y-2 mb-10 sm:mb-12 text-center sm:text-left"
        >
          <div>
            <SectionTag>
              <span className="uppercase font-bold tracking-wider">
                STUDY ABROAD
              </span>
            </SectionTag>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
            Choose Your Destination
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Discover the best study options in Italy, France, the Netherlands
            and Poland. Each country offers unique opportunities, world-class
            education and a rich cultural experience.
          </p>
        </div>

        {/* 4 Destinations Grid (1 row on large screens, matching mockup) */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {COUNTRIES.map((country) => {
            const Flag = country.FlagComponent;
            return (
              <div
                key={country.slug}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header with Overlapping Circular Flag */}
                  <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={country.image}
                      alt={country.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Circular Flag Badge overlapping bottom-left */}
                    <div className="absolute -bottom-3 left-4 w-9 h-9 rounded-full border-2 border-white shadow-xs overflow-hidden z-10 bg-white">
                      <Flag className="w-full h-full" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="pt-6 p-5 sm:p-6 space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {country.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {country.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 mt-4">
                  <Link
                    href={`/destinations/${country.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 group-hover:gap-2 transition-all duration-150 cursor-pointer pt-3"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
