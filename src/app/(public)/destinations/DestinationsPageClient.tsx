"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import DestinationCard from "@/components/destinations/DestinationCard";
import type { Destination } from "@/lib/destinationData";
import SectionTag from "@/components/ui/section-tag";
import { FranceFlag, ItalyFlag } from "@/components/home/hero/CountryFlags";

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
    <main className="grow bg-background">
      {/* ── Page Hero ── */}
      <section className="py-16 sm:py-24 bg-linear-to-b from-secondary/40 via-background to-background border-b border-border relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  text-center space-y-6">
          <SectionTag>GLOBAL STUDY SPOTS</SectionTag>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
            Top Study Destinations for <br className="hidden sm:inline" />
            <span className="text-primary">International Students</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Detailed breakdowns of degree structures, IELTS band requirements,
            tuition and living cost estimates, and post-study work visa rights.
          </p>

          {/* Search Filter Bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by country or feature (e.g. France, Italy, DSU, English Master's)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Destinations List ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          {filtered.length > 0 ? (
            <div className="space-y-6">
              {filtered.map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              No destinations matched "{searchQuery}". Try searching for France
              or Italy.
            </div>
          )}
        </div>
      </section>

      {/* ── Quick Comparison Matrix ── */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Comparative Overview at a Glance
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Key benchmarks across all supported countries for quick planning.
            </p>
          </div>

          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4 sm:p-5">Destination</th>
                    <th className="p-4 sm:p-5">Average Tuition</th>
                    <th className="p-4 sm:p-5">Monthly Living Cost</th>
                    <th className="p-4 sm:p-5">Post-Study Work Visa</th>
                    <th className="p-4 sm:p-5">Primary Intakes</th>
                    <th className="p-4 sm:p-5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {destinations.map((d) => (
                    <tr
                      key={d.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 sm:p-5 font-bold text-foreground whitespace-nowrap">
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
                      <td className="p-4 sm:p-5 text-muted-foreground whitespace-nowrap">
                        {d.stats.avgTuition}
                      </td>
                      <td className="p-4 sm:p-5 text-muted-foreground whitespace-nowrap">
                        {d.stats.livingCost}
                      </td>
                      <td className="p-4 sm:p-5 whitespace-nowrap font-medium text-foreground">
                        {d.stats.postStudyWork}
                      </td>
                      <td className="p-4 sm:p-5 text-muted-foreground whitespace-nowrap">
                        {d.stats.intakeMonths}
                      </td>
                      <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                        <Link
                          href={`/destinations/${d.slug}`}
                          className="text-xs font-bold text-primary hover:underline"
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
      <section className="py-20 bg-background relative overflow-hidden text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="relative bg-[#183ce4] rounded-3xl sm:rounded-4xl p-10 sm:p-16 lg:p-20 text-white text-center shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
                Need Help Choosing the Right Country?
              </h2>
              <p className="text-base text-white/90 max-w-xl mx-auto leading-relaxed">
                Every candidate has unique financial limits, academic
                transcripts, and post-study career goals. Let's analyze your
                options together.
              </p>
              <div className="pt-2 flex justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg shadow-amber-400/20 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                >
                  <span>Schedule a 1-on-1 Consultation</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
