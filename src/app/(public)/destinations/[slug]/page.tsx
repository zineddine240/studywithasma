import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck,
  GraduationCap,
  HelpCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Compass,
} from "lucide-react";
import {
  getAllDestinations,
  getDestinationBySlug,
} from "@/lib/destinationData";
import { FranceFlag, ItalyFlag } from "@/components/home/hero/CountryFlags";

const FLAG_MAP: Record<string, React.FC<{ className?: string }>> = {
  france: FranceFlag,
  italy: ItalyFlag,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const destinations = getAllDestinations();
  return destinations.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return {
      title: "Destination Not Found | Study With Asma",
    };
  }

  return {
    title: `Study in ${destination.name} | Requirements, Costs & Visas | Study With Asma`,
    description: `Complete guide to studying in ${destination.name}: university entry requirements, IELTS band thresholds, 2025/2026 tuition & living costs, and post-study work visas.`,
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  return (
    <main className="grow bg-background">
      {/* ── Breadcrumb & Back Nav ── */}
      <div className="bg-muted/40 border-b border-border py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  flex items-center justify-between text-xs text-muted-foreground">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 hover:text-foreground font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Destinations</span>
          </Link>
          <div className="flex items-center gap-2">
            <span>Destinations</span>
            <span>/</span>
            <span className="text-foreground font-bold">
              {destination.name}
            </span>
          </div>
        </div>
      </div>

      {/* ── Destination Hero ── */}
      <section className="relative py-16 sm:py-24 border-b border-border overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={destination.heroImage}
            alt={destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" />
            <span>
              {(() => {
                const F = FLAG_MAP[destination.slug];
                return F ? (
                  <F className="w-4 h-4 inline-block align-middle mr-1" />
                ) : null;
              })()}
              {destination.popularFor}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-white tracking-tight">
            Study in {destination.name}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
            {destination.tagline}
          </p>

          {/* Quick Stats Grid */}
          <div className="pt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Avg Tuition
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                {destination.stats.avgTuition}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Est. Living Cost
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                {destination.stats.livingCost}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Post-Study Work
              </div>
              <div className="text-base sm:text-lg font-bold text-amber-300">
                {destination.stats.postStudyWork}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Primary Intakes
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                {destination.stats.intakeMonths}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left 8 Columns: Narrative, Requirements, Process */}
            <div className="lg:col-span-8 space-y-16">
              {/* 1. Overview & Key Advantages */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  Overview &amp; Academic System
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {destination.overview}
                </p>

                <div className="bg-card rounded-2xl border border-border p-6 space-y-3 shadow-xs">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Key Advantages for International Students:
                  </h3>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    {destination.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 2. Study Opportunities by Level */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  Study Opportunities &amp; Top Fields
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {destination.studyOpportunities.map((opp, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-2xl border border-border p-6 space-y-3"
                    >
                      <h3 className="font-serif font-bold text-lg text-foreground">
                        {opp.level}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {opp.description}
                      </p>
                      <div className="pt-2">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                          Popular Disciplines:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {opp.topFields.map((f, fi) => (
                            <span
                              key={fi}
                              className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Entry & English Language Requirements */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  Entry &amp; English Requirements
                </h2>

                <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-6">
                  {/* Academic Requirements */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span>Academic Background</span>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {destination.entryRequirements.academic}
                    </p>
                  </div>

                  {/* English Language Requirements Table */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-primary" />
                      <span>IELTS Score Benchmarks</span>
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-1">
                        <div className="text-xs text-muted-foreground font-semibold">
                          Undergraduate Threshold
                        </div>
                        <div className="text-base font-bold text-foreground">
                          {
                            destination.entryRequirements.englishRequirements
                              .undergraduate
                          }
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-1">
                        <div className="text-xs text-muted-foreground font-semibold">
                          Postgraduate (Master's) Threshold
                        </div>
                        <div className="text-base font-bold text-foreground">
                          {
                            destination.entryRequirements.englishRequirements
                              .postgraduate
                          }
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground italic pt-1">
                      {destination.entryRequirements.englishRequirements.notes}
                    </p>
                  </div>

                  {/* Required Documents */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Standard Required Documentation:
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-foreground/90">
                      {destination.entryRequirements.documentsRequired.map(
                        (doc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            <span>{doc}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. Estimated Costs & Financial Transparency */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                    Estimated Costs of Attendance
                  </h2>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {destination.estimatedCosts.academicYear}
                  </span>
                </div>

                <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5 p-4 rounded-2xl bg-muted/50 border border-border">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Tuition Fee Range
                      </div>
                      <div className="text-base font-bold text-foreground">
                        {destination.estimatedCosts.tuitionRange}
                      </div>
                    </div>
                    <div className="space-y-1.5 p-4 rounded-2xl bg-muted/50 border border-border">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Living &amp; Housing Expenses
                      </div>
                      <div className="text-base font-bold text-foreground">
                        {destination.estimatedCosts.livingExpenses}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-4 rounded-2xl bg-muted/50 border border-border">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Health Insurance / Coverage
                    </div>
                    <div className="text-sm text-foreground">
                      {destination.estimatedCosts.healthInsurance}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    <strong>Financial Transparency Notice:</strong>{" "}
                    {destination.estimatedCosts.disclaimer}
                  </div>
                </div>
              </div>

              {/* 5. Application Process Steps */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  Step-by-Step Application Roadmap
                </h2>

                <div className="space-y-4">
                  {destination.applicationProcess.map((step) => (
                    <div
                      key={step.step}
                      className="bg-card rounded-2xl border border-border p-6 flex items-start gap-5 hover:border-primary/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-serif font-bold text-lg text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Official Resources & Portals */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  Official Resources &amp; Government Portals
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {destination.officialResources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-card rounded-2xl border border-border p-5 hover:border-primary transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-primary">
                          {res.organization}
                        </div>
                        <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {res.title}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Action Panel */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {/* Consultation Card */}
              <div className="bg-card rounded-3xl border-2 border-primary/30 p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Compass className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-foreground">
                    Plan Your {destination.name} Application
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Schedule a 1-on-1 consultation with Asma to assess your
                    grades, determine your required IELTS band, and build your
                    university shortlist.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href={`/contact?destination=${destination.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-full font-bold text-sm hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
                  >
                    <span>Request {destination.shortName} Guidance</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/level-test"
                    className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-full font-semibold text-xs hover:bg-secondary/80 transition-colors border border-border"
                  >
                    <span>Check Your IELTS Level First</span>
                  </Link>
                </div>

                <div className="pt-4 border-t border-border text-[11px] text-muted-foreground leading-relaxed text-center">
                  Direct WhatsApp consultation: <br />
                  <a
                    href="https://wa.me/213797328745"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary font-bold hover:underline"
                  >
                    +213 797 32 87 45
                  </a>
                </div>
              </div>

              {/* Sample Leading Universities */}
              <div className="bg-card rounded-3xl border border-border p-6 space-y-4 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Sample Institutions in {destination.shortName}:
                </h4>
                <div className="space-y-2.5">
                  {destination.popularUniversities.map((uni, i) => (
                    <div
                      key={i}
                      className="text-xs border-b border-border/60 pb-2.5 last:border-0 last:pb-0"
                    >
                      <div className="font-bold text-foreground">
                        {uni.name}
                      </div>
                      <div className="text-muted-foreground flex items-center justify-between mt-0.5">
                        <span>{uni.city}</span>
                        <span className="text-[10px] text-primary">
                          {uni.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
