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
    <main className="grow bg-background">
      {/* ── Page Hero ── */}
      <section className="py-16 sm:py-24 bg-linear-to-b from-secondary/40 via-background to-background border-b border-border relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0  text-center space-y-6">
          <SectionTag>STRATEGIC STUDY ABROAD GUIDANCE</SectionTag>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
            Strategic Study Abroad Guidance <br className="hidden sm:inline" />
            <span className="text-primary">Tailored to Your Real Goals</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From shortlisting accredited institutions in France and Italy to
            crafting winning Statements of Purpose and navigating student visa
            regulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold text-sm hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
            >
              <span>Book an Advisory Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/destinations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card text-foreground border border-border px-8 py-3.5 rounded-full font-bold text-sm hover:bg-secondary transition-colors"
            >
              <span>Explore Supported Countries</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6 Core Services Grid ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              End-to-End International Guidance
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
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
                  className="bg-card rounded-3xl border border-border p-8 space-y-6 hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary px-3 py-1 rounded-full text-muted-foreground border border-border">
                        {srv.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-foreground">
                      {srv.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {srv.fullDesc}
                    </p>

                    <div className="pt-2 space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Key Deliverables:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-foreground/90">
                        {srv.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
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
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-2">
                Supported Study Destinations
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Click on any country to explore admissions requirements,
                language scores, and estimated costs.
              </p>
            </div>
            <Link
              href="/destinations"
              className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
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
      <section className="py-20 bg-background relative overflow-hidden text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
          <div className="relative bg-[#183ce4] rounded-3xl sm:rounded-4xl p-10 sm:p-16 lg:p-20 text-white text-center shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
                Schedule Your Profile Evaluation
              </h2>
              <p className="text-base text-white/90 max-w-xl mx-auto leading-relaxed">
                Tell us about your degree, GPA, target intake, and budget. We
                will review your profile and propose clear, actionable steps.
              </p>
              <div className="pt-2 flex justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg shadow-amber-400/20 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                >
                  <span>Request Consultation</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
