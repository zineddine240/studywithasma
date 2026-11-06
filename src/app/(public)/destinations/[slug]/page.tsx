import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  FileCheck,
  GraduationCap,
  ExternalLink,
  Compass,
  Calendar,
  Languages,
  BadgeEuro,
  Plane,
} from "lucide-react";
import {
  getAllDestinations,
  getDestinationBySlug,
} from "@/lib/destinationData";
import {
  FranceFlag,
  ItalyFlag,
  NetherlandsFlag,
  PolandFlag,
} from "@/components/ui/CountryFlags";
import { SectionTag } from "@/components/ui/section-tag";
import NewCtaSection from "@/components/home/NewCtaSection";

const FLAG_MAP: Record<string, React.FC<{ className?: string }>> = {
  france: FranceFlag,
  italy: ItalyFlag,
  netherlands: NetherlandsFlag,
  poland: PolandFlag,
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
    description: `Complete guide to studying in ${destination.name}: university entry requirements, language requirements, tuition costs, Campus France procedures and visa information.`,
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const cf = destination.campusFranceInfo;
  const it = destination.italyInfo;

  return (
    <main className="grow bg-white">
      {/* ── Breadcrumb & Back Nav ── */}
      <div className="bg-[#FAFAFC] border-b border-slate-200/80 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 hover:text-slate-900 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Destinations</span>
          </Link>
          <div className="flex items-center gap-2">
            <span>Destinations</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">{destination.name}</span>
          </div>
        </div>
      </div>

      {/* ── Destination Hero ── */}
      <section className="relative py-14 sm:py-20 border-b border-slate-200/80 overflow-hidden bg-[#FAFAFC]">
        <div className="absolute inset-0 z-0">
          <Image
            src={destination.heroImage}
            alt={destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFC] via-[#FAFAFC]/90 to-[#FAFAFC]/50" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <SectionTag>
              <span className="uppercase font-bold tracking-wider">
                {(() => {
                  const F = FLAG_MAP[destination.slug];
                  return F ? (
                    <F className="w-4 h-4 inline-block align-middle mr-1.5" />
                  ) : null;
                })()}
                {destination.popularFor}
              </span>
            </SectionTag>

            {cf && (
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  Campaign {cf.applicationCampaign} · Opens{" "}
                  {cf.campusFranceOpens}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0B1536] tracking-tight">
            Study in {destination.name}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl leading-relaxed">
            {destination.tagline}
          </p>

          {/* Quick Stats Grid */}
          <div className="pt-2 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Avg Tuition
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {destination.stats.avgTuition}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Est. Living Cost
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {destination.stats.livingCost}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Post-Study Work
              </div>
              <div className="text-base sm:text-lg font-bold text-amber-600">
                {destination.stats.postStudyWork}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Primary Intakes
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {destination.stats.intakeMonths}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left 8 Columns */}
            <div className="lg:col-span-8 space-y-14">
              {/* 1. Overview & Academic System */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                  Overview &amp; Academic System
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  {destination.overview}
                </p>

                {/* France: LMD Structure */}
                {cf && (
                  <div className="bg-blue-50/70 rounded-2xl border border-blue-200/80 p-5 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900">
                      LMD Higher Education Structure
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {cf.lmdStructure.map((item, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-xl border border-blue-100 p-3 text-center space-y-1 shadow-2xs"
                        >
                          <div className="text-base font-bold text-blue-700">
                            {item.level}
                          </div>
                          <div className="text-[11px] text-slate-500 leading-snug">
                            {item.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-2xs">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    {cf
                      ? "Why Choose France?"
                      : "Key Advantages for International Students:"}
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {(cf ? cf.whyFrance : destination.highlights).map(
                      (h, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              {/* 2. Study Opportunities */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                  Study Opportunities &amp; Top Fields
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {destination.studyOpportunities.map((opp, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-2xs"
                    >
                      <h3 className="font-bold text-lg text-slate-900">
                        {opp.level}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {opp.description}
                      </p>
                      <div className="pt-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Popular Disciplines:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {opp.topFields.map((f, fi) => (
                            <span
                              key={fi}
                              className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold"
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

              {/* 3. Entry & Language Requirements */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                  {cf
                    ? "Entry & Language Requirements"
                    : "Entry & English Requirements"}
                </h2>

                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                  {/* Academic Background */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span>Academic Background</span>
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {destination.entryRequirements.academic}
                    </p>
                  </div>

                  {/* France: French Language */}
                  {cf && (
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <Languages className="w-4 h-4 text-indigo-600" />
                        <span>French Language Requirements</span>
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                            Campus France Min.
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {cf.frenchLanguageRequirements.minimumLevel}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                            Most Institutions
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {cf.frenchLanguageRequirements.institutionLevel}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Humanities / Social Sci.
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {
                              cf.frenchLanguageRequirements
                                .recommendedForHumanities
                            }
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Accepted Certifications:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {cf.frenchLanguageRequirements.acceptedCertifications.map(
                            (cert, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold"
                              >
                                {cert}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic">
                        {cf.frenchLanguageRequirements.note}
                      </p>
                    </div>
                  )}

                  {/* English Language / IELTS */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-indigo-600" />
                      <span>
                        {cf
                          ? "English-Taught Programmes"
                          : "IELTS Score Benchmarks"}
                      </span>
                    </h3>

                    {!cf && (
                      <div className="grid sm:grid-cols-2 gap-4 pt-1">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="text-xs text-slate-500 font-semibold">
                            Undergraduate Threshold
                          </div>
                          <div className="text-base font-bold text-slate-900">
                            {
                              destination.entryRequirements.englishRequirements
                                .undergraduate
                            }
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="text-xs text-slate-500 font-semibold">
                            Postgraduate (Master&apos;s) Threshold
                          </div>
                          <div className="text-base font-bold text-slate-900">
                            {
                              destination.entryRequirements.englishRequirements
                                .postgraduate
                            }
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 italic pt-1">
                      {destination.entryRequirements.englishRequirements.notes}
                    </p>
                  </div>

                  {/* Required Documents */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Standard Required Documentation:
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                      {destination.entryRequirements.documentsRequired.map(
                        (doc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                            <span>{doc}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* France: Campus France Application Calendar */}
              {cf && (
                <div className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                    Campus France Algérie – 2027 Application Calendar
                  </h2>
                  <div className="space-y-4">
                    {cf.applicationProcedures.map((proc, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs"
                      >
                        <div className="flex items-center gap-3 p-4 bg-slate-100 border-b border-slate-200 text-slate-900">
                          <span className="text-xs font-black bg-[#F59E0B] text-slate-950 px-2.5 py-1 rounded-md">
                            {proc.code}
                          </span>
                          <span className="font-bold text-sm text-slate-900">
                            {proc.name}
                          </span>
                        </div>
                        <div className="p-5 grid sm:grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              Eligible For:
                            </div>
                            <ul className="space-y-1.5">
                              {proc.eligibleFor.map((item, j) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-xs text-slate-700"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              Key Deadlines:
                            </div>
                            <div className="space-y-2">
                              {proc.deadlines.map((dl, j) => (
                                <div
                                  key={j}
                                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                                >
                                  <span className="text-xs text-slate-500">
                                    {dl.label}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900">
                                    {dl.date}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    These are published deadlines for the 2027 campaign.
                    Specific institutions and programmes may have additional
                    deadlines.
                  </p>
                </div>
              )}

              {/* France: Application Fees */}
              {cf && (
                <div className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                    Campus France Application Fees
                  </h2>
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-2xs">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <BadgeEuro className="w-4 h-4 text-indigo-600" />
                      <span>2026 Campaign – Published Fee Schedule</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center">
                        <div className="text-2xl font-black text-slate-900">
                          {cf.applicationFees.full}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold">
                          Full Application Fee
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-center">
                        <div className="text-2xl font-black text-emerald-800">
                          {cf.applicationFees.reduced}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold">
                          Reduced Fee ({cf.applicationFees.reducedNote})
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {cf.applicationFees.note}
                    </p>
                  </div>
                </div>
              )}

              {/* 4. Estimated Costs */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                    Estimated Costs of Attendance
                  </h2>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    {destination.estimatedCosts.academicYear}
                  </span>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                  {/* Italy: DSU Regional Scholarships & Registration Fees */}
                  {it?.dsuScholarship && (
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                          {it.dsuScholarship.title}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shrink-0">
                          {it.dsuScholarship.maxAmount}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-800">
                        {it.dsuScholarship.benefits.map((b, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/60 text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">
                          Regional Example:{" "}
                        </strong>
                        {it.dsuScholarship.example}
                      </div>

                      <ul className="space-y-1.5 pt-1">
                        {it.dsuScholarship.notes.map((n, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-slate-600 flex items-start gap-1.5"
                          >
                            <span className="text-emerald-600 font-bold">
                              •
                            </span>
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* France: Standard Public University Registration Fees */}
                  {cf?.standardTuitionFees && (
                    <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                          Public University Tuition (2026/2027)
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Exemption Rates
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-blue-100 text-center space-y-0.5 shadow-2xs">
                          <div className="text-lg sm:text-xl font-black text-slate-900">
                            {cf.standardTuitionFees.licence}
                          </div>
                          <div className="text-[11px] text-slate-500 font-semibold">
                            Licence (Bachelor&apos;s)
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-blue-100 text-center space-y-0.5 shadow-2xs">
                          <div className="text-lg sm:text-xl font-black text-slate-900">
                            {cf.standardTuitionFees.master}
                          </div>
                          <div className="text-[11px] text-slate-500 font-semibold">
                            Master&apos;s
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-blue-100 text-center space-y-0.5 shadow-2xs">
                          <div className="text-lg sm:text-xl font-black text-slate-900">
                            {cf.standardTuitionFees.doctorate}
                          </div>
                          <div className="text-[11px] text-slate-500 font-semibold">
                            Doctorate
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {cf.standardTuitionFees.note}
                      </p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {cf
                          ? "Differentiated Tuition (Without Exemption)"
                          : "Tuition Fee Range"}
                      </div>
                      <div className="text-base font-bold text-slate-900">
                        {destination.estimatedCosts.tuitionRange}
                      </div>
                    </div>
                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Living &amp; Housing Expenses
                      </div>
                      <div className="text-base font-bold text-slate-900">
                        {destination.estimatedCosts.livingExpenses}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Health Insurance / Coverage
                    </div>
                    <div className="text-sm text-slate-800">
                      {destination.estimatedCosts.healthInsurance}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    <strong>Financial Transparency Notice:</strong>{" "}
                    {destination.estimatedCosts.disclaimer}
                  </div>
                </div>
              </div>

              {/* France: Visa & Residence */}
              {cf && (
                <div className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536] flex items-center gap-3">
                    <Plane className="w-7 h-7 text-indigo-600" />
                    Visa &amp; Residence Formalities
                  </h2>
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="text-xs font-black bg-indigo-600 text-white px-3 py-1.5 rounded-lg shrink-0">
                        Visa Type
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {cf.visaInfo.type}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Application Platform
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          {cf.visaInfo.platform}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Financial Requirement
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {cf.visaInfo.financialRequirement}
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {cf.visaInfo.notes.map((note, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 5. Application Process */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                  Step-by-Step Application Roadmap
                </h2>

                <div className="space-y-4">
                  {destination.applicationProcess.map((step) => (
                    <div
                      key={step.step}
                      className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-start gap-5 shadow-2xs hover:border-indigo-400 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg text-slate-900">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Official Resources */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536]">
                  Official Resources &amp; Government Portals
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ...destination.officialResources,
                    ...(cf?.officialResourcesExtra ?? []),
                  ].map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-indigo-500 transition-all flex items-center justify-between shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-indigo-600">
                          {res.organization}
                        </div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {res.title}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Action Panel */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {/* Consultation Card */}
              <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 sm:p-8 space-y-6 shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Compass className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-[#0B1536]">
                    Plan Your {destination.name} Application
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Schedule a 1-on-1 consultation with Asma to assess your
                    grades, determine your required IELTS band, and build your
                    university shortlist.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href={`/contact?destination=${destination.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 py-3.5 rounded-full font-bold text-sm transition-all shadow-sm"
                  >
                    <span>Request {destination.shortName} Guidance</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/level-test"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-full font-semibold text-xs transition-colors border border-slate-200"
                  >
                    <span>Check Your IELTS Level First</span>
                  </Link>
                </div>

                <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed text-center">
                  Direct WhatsApp consultation: <br />
                  <a
                    href="https://wa.me/213797328745"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    +213 797 32 87 45
                  </a>
                </div>
              </div>

              {/* Sample Leading Universities */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Sample Institutions in {destination.shortName}:
                </h4>
                <div className="space-y-2.5">
                  {destination.popularUniversities.map((uni, i) => (
                    <div
                      key={i}
                      className="text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
                    >
                      <div className="font-bold text-slate-900">{uni.name}</div>
                      <div className="text-slate-500 flex items-center justify-between mt-0.5">
                        <span>{uni.city}</span>
                        <span className="text-[10px] text-indigo-600 font-semibold">
                          {uni.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* France: Campaign Info Card */}
              {cf && (
                <div className="bg-amber-50/80 rounded-2xl sm:rounded-3xl p-6 space-y-3 text-slate-900 border border-amber-200/80 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      2027 Campaign
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900">Application Open</h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Campaign opens</span>
                      <span className="font-bold text-slate-900">
                        {cf.campusFranceOpens}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>DAP deadline</span>
                      <span className="font-bold text-slate-900">
                        15 Dec 2026
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hors DAP deadline</span>
                      <span className="font-bold text-slate-900">
                        30 Nov 2026
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interview deadline</span>
                      <span className="font-bold text-slate-900">
                        15 Mar 2027
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://algerie.campusfrance.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#F59E0B] text-slate-950 py-2.5 rounded-full font-bold text-xs hover:bg-[#E58F00] transition-colors mt-2"
                  >
                    <span>Open Études en France</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <NewCtaSection />
    </main>
  );
}
