import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  GraduationCap,
  FileCheck,
  Award,
  Shield,
  Plane,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Globe,
  HelpCircle,
} from "lucide-react";
import { STUDY_ABROAD_SERVICES, GENERAL_FAQS } from "@/lib/studyAbroadData";
import { getAllDestinations } from "@/lib/destinationData";
import DestinationCard from "@/components/destinations/DestinationCard";
import SectionTag from "@/components/ui/section-tag";
import NewCtaSection from "@/components/home/NewCtaSection";

export const metadata = {
  title: "Study Abroad Consulting & University Guidance | Study With Asma",
  description:
    "Expert international education consulting for France and Italy. University matching, SOP editing, scholarship research, and student visa guidance.",
};

const iconMap = {
  Compass: Compass,
  GraduationCap: GraduationCap,
  FileCheck: FileCheck,
  Award: Award,
  Shield: Shield,
  Plane: Plane,
};

export default function StudyAbroadPage() {
  const destinations = getAllDestinations();

  return (
    <main className="grow bg-white">
      {/* ── Page Hero ── */}
      <section className="py-14 sm:py-20 bg-[#FAFAFC] border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div>
            <SectionTag>STRATEGIC STUDY ABROAD GUIDANCE</SectionTag>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1536] tracking-tight max-w-4xl mx-auto leading-tight">
            Strategic Study Abroad Guidance <br className="hidden sm:inline" />
            <span className="text-indigo-600">Tailored to Your Real Goals</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From shortlisting accredited institutions in France and Italy to
            crafting winning Statements of Purpose and navigating student visa
            regulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-sm"
            >
              <span>Book an Advisory Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/destinations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <span>Explore Supported Countries</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6 Core Services Grid ── */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536]">
              End-to-End International Guidance
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A comprehensive advisory framework to ensure your academic and
              visa dossier is compliant, competitive, and timely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STUDY_ABROAD_SERVICES.map((srv) => {
              const Icon = iconMap[srv.iconName];
              return (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-8 space-y-6 hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full text-slate-600 border border-slate-200">
                        {srv.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {srv.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {srv.fullDesc}
                    </p>

                    <div className="pt-2 space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Key Deliverables:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {srv.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>Inquire About This Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Study Destinations ── */}
      <section className="py-16 sm:py-20 bg-[#FAFAFC] border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] mb-2">
                Supported Study Destinations
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Click on any country to explore admissions requirements,
                language scores, and estimated costs.
              </p>
            </div>
            <Link
              href="/destinations"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-6">
            {destinations.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Consultation CTA ── */}
      <NewCtaSection />
    </main>
  );
}
