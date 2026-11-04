"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FranceFlag, ItalyFlag } from "@/components/home/hero/CountryFlags";

interface CountryCardData {
  title: string;
  slug: string;
  description: string;
  image: string;
  FlagComponent: React.FC<{ className?: string }>;
}

const COUNTRIES: CountryCardData[] = [
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
    title: "Study in Italy",
    slug: "italy",
    description:
      "Top-ranked universities, a rich culture and affordable education options.",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop",
    FlagComponent: ItalyFlag,
  },
];

export default function NewDestinationsSection() {
  return (
    <section id="destinations" className="py-12 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-2 mb-8 sm:mb-10 text-center sm:text-left">
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-600">
            STUDY ABROAD
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
            Choose Your Destination
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Discover the best study options in France and Italy. Each country
            offers unique opportunities, world-class education and a rich
            cultural experience.
          </p>
        </div>

        {/* 2 Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto sm:mx-0">
          {COUNTRIES.map((country) => {
            const Flag = country.FlagComponent;
            return (
              <div
                key={country.slug}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Photo Header with Overlapping Circular Flag */}
                <div className="relative h-48 sm:h-56 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={country.image}
                    alt={country.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Circular Flag Badge overlapping bottom-left */}
                  <div className="absolute -bottom-3 left-4 w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden z-10 bg-white">
                    <Flag className="w-full h-full" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-6 p-5 sm:p-6 flex flex-col grow justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      {country.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-5">
                      {country.description}
                    </p>
                  </div>

                  <Link
                    href={`/destinations/${country.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 group-hover:gap-2 transition-all duration-150 cursor-pointer pt-3 border-t border-slate-100"
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
