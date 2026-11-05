"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import DestinationCard from "@/components/destinations/DestinationCard";
import type { Destination } from "@/lib/destinationData";
import SectionTag from "@/components/ui/section-tag";
import { FranceFlag, ItalyFlag } from "@/components/home/hero/CountryFlags";
import NewCtaSection from "@/components/home/NewCtaSection";

interface DestinationsPageClientProps {
  destinations: Destination[];
}

export default function DestinationsPageClient({
  destinations,
}: DestinationsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = destinations.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.popularFor.toLowerCase().includes(q)
    );
  });

  return (
    <main className="grow bg-white">
      {/* ── Page Hero ── */}
      <section className="pt-10 sm:pt-14 pb-14 sm:pb-20 bg-[#FAFAFC] border-b border-slate-100 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <SectionTag>GLOBAL STUDY SPOTS</SectionTag>
          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0B1536] tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Top Study Destinations in Europe
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Detailed breakdowns of degree structures, IELTS band requirements,
            tuition, DSU scholarship grants, and post-study work visa rights in
            France and Italy.
          </p>

          <div className="pt-2 select-none -rotate-1">
            <span className="font-handwriting text-2xl sm:text-3xl font-bold text-indigo-700">
              Your European campus awaits ♡
            </span>
          </div>

          {/* Search Filter Bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by country or feature (e.g. France, Italy, DSU, English Master's)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 shadow-2xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Destinations List ── */}
      <section className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="space-y-6">
              {filtered.map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-sm">
              No destinations matched &ldquo;{searchQuery}&rdquo;. Try searching
              for France or Italy.
            </div>
          )}
        </div>
      </section>

      {/* ── Quick Comparison Matrix ── */}
      <section className="py-14 sm:py-20 bg-[#FAFAFC] border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
            <SectionTag>COMPARATIVE MATRIX</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              Overview at a Glance
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Key benchmarks across France and Italy for clear, confident
              planning.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4 sm:p-5">Destination</th>
                    <th className="p-4 sm:p-5">Average Tuition</th>
                    <th className="p-4 sm:p-5">Monthly Living Cost</th>
                    <th className="p-4 sm:p-5">Post-Study Work Visa</th>
                    <th className="p-4 sm:p-5">Primary Intakes</th>
                    <th className="p-4 sm:p-5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {destinations.map((d) => (
                    <tr
                      key={d.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="p-4 sm:p-5 font-bold text-slate-900 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          {d.id === "france" ? (
                            <FranceFlag className="w-5 h-5 inline-block shrink-0" />
                          ) : d.id === "italy" ? (
                            <ItalyFlag className="w-5 h-5 inline-block shrink-0" />
                          ) : (
                            <span className="text-base">{d.flag}</span>
                          )}
                          <span>{d.name}</span>
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500 whitespace-nowrap">
                        {d.stats.avgTuition}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500 whitespace-nowrap">
                        {d.stats.livingCost}
                      </td>
                      <td className="p-4 sm:p-5 whitespace-nowrap font-medium text-slate-900">
                        {d.stats.postStudyWork}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500 whitespace-nowrap">
                        {d.stats.intakeMonths}
                      </td>
                      <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                        <Link
                          href={`/destinations/${d.slug}`}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                          View Guide →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <NewCtaSection />
    </main>
  );
}
