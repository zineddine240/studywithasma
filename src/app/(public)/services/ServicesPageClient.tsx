"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileText,
  GraduationCap,
  PenTool,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import SectionTag from "@/components/ui/section-tag";
import NewCtaSection from "@/components/home/NewCtaSection";

interface ServiceDetail {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  deliverables: string[];
  idealFor: string;
  destinationsCovered: string[];
  timeline: string;
  ctaText: string;
  ctaHref: string;
}

const SERVICES_DETAILED: ServiceDetail[] = [
  {
    id: "consultation",
    number: "01",
    title: "Initial Consultation",
    tagline: "Profile Audit & Strategic Roadmap",
    description:
      "A focused 1-on-1 strategic session to evaluate your academic profile, English proficiency, and financial budget against European university standards.",
    icon: Users,
    deliverables: [
      "Comprehensive evaluation of academic transcripts and GPA",
      "Country admissibility audit (Italy, France, Netherlands, Poland)",
      "Scholarship eligibility assessment (DSU grant €7,000/yr, regional aid)",
      "Personalized timeline and intake deadline schedule",
    ],
    idealFor:
      "Students exploring European study abroad for the first time who need clear, realistic options.",
    destinationsCovered: ["Italy", "France", "Netherlands", "Poland"],
    timeline: "60-minute live 1-on-1 session + written roadmap",
    ctaText: "Book Initial Consultation",
    ctaHref: "/contact?service=consultation",
  },
  {
    id: "university-selection",
    number: "02",
    title: "University & Program Selection",
    tagline: "Curated High-Acceptance Academic Matching",
    description:
      "Personalized shortlisting of accredited European universities and English-taught programs aligned with your career goals and profile strengths.",
    icon: Search,
    deliverables: [
      "Curated shortlist of 5 to 8 high-acceptance target programs",
      "Detailed tuition benchmarks and living cost projections",
      "English requirement check (IELTS Academic band requirements vs waivers)",
      "Post-study stay-back visa and graduate employment analysis",
    ],
    idealFor:
      "Applicants looking to maximize admissions success without wasting fees on ineligible programs.",
    destinationsCovered: ["Italy", "France", "Netherlands", "Poland"],
    timeline: "3–5 business days turnaround with full breakdown report",
    ctaText: "Get University Shortlist",
    ctaHref: "/contact?service=university-selection",
  },
  {
    id: "document-guidance",
    number: "03",
    title: "Document Guidance & File Audit",
    tagline: "Dossier Verification & Legalization Prep",
    description:
      "Meticulous review and compliance check for every document required by European admissions boards and official government portals.",
    icon: FileText,
    deliverables: [
      "Standardized checklist for Campus France / Universitaly requirements",
      "Guidance on Apostille, certified translations, and CIMEA / DOV",
      "Academic Europass CV structuring and formatting",
      "Pre-submission compliance check to prevent administrative rejection",
    ],
    idealFor:
      "Students preparing dossiers who want zero mistakes on official university and embassy paperwork.",
    destinationsCovered: ["France (Campus France)", "Italy (Universitaly)"],
    timeline: "Ongoing document verification throughout your application",
    ctaText: "Review My Documents",
    ctaHref: "/contact?service=documents",
  },
  {
    id: "motivation-letter",
    number: "04",
    title: "Motivation Letter & SOP Support",
    tagline: "Compelling Academic Narrative Coaching",
    description:
      "In-depth editing, structural refinement, and narrative coaching to make your Statement of Purpose (SOP) stand out to competitive admission committees.",
    icon: PenTool,
    deliverables: [
      "Multi-draft line-by-line feedback and academic tone refinement",
      "Highlighting unique strengths, career ambitions, and academic fit",
      "Elimination of generic AI-generated clichés and grammatical flaws",
      "Tailoring for country conventions (Lettre de Motivation vs. Italian SOP)",
    ],
    idealFor:
      "Applicants who need a persuasive, authentic statement that convinces selective admissions committees.",
    destinationsCovered: ["All European Universities"],
    timeline: "2 rounds of detailed revision within 4–6 business days",
    ctaText: "Refine My Motivation Letter",
    ctaHref: "/contact?service=motivation-letter",
  },
  {
    id: "application-guidance",
    number: "05",
    title: "Application & Visa Guidance",
    tagline: "End-to-End Submission & Embassy Mock Interviews",
    description:
      "Step-by-step guidance through official national platforms, enrollment procedures, and rigorous embassy student visa preparation.",
    icon: ShieldCheck,
    deliverables: [
      "Step-by-step navigation of Campus France Études en France or Universitaly",
      "Financial guarantee calculation and blocked account guidance",
      "1-on-1 embassy visa mock interview simulation with feedback",
      "Pre-departure briefing on accommodation, health insurance, and arrival",
    ],
    idealFor:
      "Admitted students aiming for a seamless visa approval and smooth transition to Europe.",
    destinationsCovered: ["France", "Italy", "Netherlands", "Poland"],
    timeline: "Dedicated support from portal submission until visa decision",
    ctaText: "Secure Application Guidance",
    ctaHref: "/contact?service=visa-guidance",
  },
];

const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "Discovery & Profile Audit",
    description:
      "We evaluate your academic history, language qualifications, and budget to pinpoint the best European destinations.",
  },
  {
    step: "02",
    title: "Curated Strategy & Selection",
    description:
      "We build a personalized list of programs with high admission odds and identify relevant scholarship deadlines.",
  },
  {
    step: "03",
    title: "Dossier Polish & Submission",
    description:
      "We polish your SOP, review your documents for compliance, and guide you through official university portals.",
  },
  {
    step: "04",
    title: "Visa Prep & Departure",
    description:
      "We conduct realistic embassy mock interviews, verify financial files, and prepare you for your flight to Europe.",
  },
];

const FAQS = [
  {
    q: "Can I book individual services or must I purchase a package?",
    a: "You can book individual standalone services (such as a single Motivation Letter review or Initial Consultation) or choose our comprehensive end-to-end advisory package depending on how much support you need.",
  },
  {
    q: "Do you assist specifically with Algerian student procedures?",
    a: "Yes! We specialize in the Campus France Algérie (Études en France) procedure for France, as well as the Universitaly portal, CIMEA statement, and VFS/TLS visa appointments for Italy.",
  },
  {
    q: "How does IELTS preparation integrate with your advisory services?",
    a: "If you need to achieve an IELTS band score for university entry or scholarship qualification, you can combine Asma's intensive IELTS courses with study abroad advisory for coordinated planning.",
  },
  {
    q: "How do we conduct consultations and document reviews?",
    a: "Consultations are conducted live via Google Meet or Zoom. Document reviews, SOP editing drafts, and checklists are exchanged directly through secure email and shared document workspaces with tracked revisions.",
  },
];

export default function ServicesPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="grow bg-white">
      {/* ── Page Hero ── */}
      <section className="pt-12 sm:pt-16 pb-14 sm:pb-20 bg-[#FAFAFC] border-b border-slate-100 text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div>
            <SectionTag>OUR ADVISORY SERVICES</SectionTag>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0B1536] tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Expert Guidance for Every Step of Your Journey
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            From strategic university selection to flawless document compliance
            and embassy visa mock interviews, get personal mentorship tailored
            to your academic ambitions.
          </p>

          <div className="pt-2 select-none -rotate-2">
            <span className="font-handwriting text-2xl sm:text-3xl font-bold text-indigo-700">
              Personalized guidance every step of the way ♡
            </span>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-xs hover:gap-3 cursor-pointer"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <a
              href="#services-list"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-full text-sm sm:text-base border border-slate-200 transition-colors"
            >
              <span>Explore All 5 Services</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </a>
          </div>
        </div>
      </section>

      {/* ── 4 Key Pillars / Trust Indicators ── */}
      <section className="py-8 sm:py-10 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1536] block">
                98%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Admission & Visa Success Rate
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1536] block">
                500+
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Students Guided to Europe
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1536] block">
                Band 7.5+
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Average IELTS Score Achieved
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1536] block">
                1-on-1
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Direct Mentorship with Asma
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 Detailed Services List ── */}
      <section
        id="services-list"
        className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-100"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <SectionTag>WHAT WE OFFER</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              Comprehensive Advisory Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every service is structured to give you transparent, actionable,
              and results-driven support.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {SERVICES_DETAILED.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all duration-300 p-6 sm:p-8 lg:p-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Number, Title, Description */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                          SERVICE {service.number}
                        </span>
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                          {service.tagline}
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                          <Icon className="w-6 h-6 stroke-[2]" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1536] tracking-tight group-hover:text-indigo-600 transition-colors">
                            {service.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        {service.description}
                      </p>

                      <div className="space-y-2 pt-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            Timeline:
                          </span>
                          <span className="text-slate-600">
                            {service.timeline}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            Destinations:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {service.destinationsCovered.map((dest) => (
                              <span
                                key={dest}
                                className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]"
                              >
                                {dest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Deliverables, Ideal For & Action Button */}
                    <div className="lg:col-span-7 bg-[#FAFAFC] rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5">
                      <div>
                        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-3">
                          What&apos;s Included in This Service
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.deliverables.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80">
                        <span className="text-xs text-slate-500 font-medium block mb-1">
                          Ideal For:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                          {service.idealFor}
                        </p>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <Link
                          href={service.ctaHref}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                        >
                          <span>{service.ctaText}</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </Link>

                        <Link
                          href="/contact"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          Ask a Question →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Working Methodology / 4-Step Process ── */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <SectionTag>OUR PROCESS</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              How We Work With You
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              A structured 4-step framework designed to eliminate guesswork and
              deliver results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {METHODOLOGY_STEPS.map((step) => (
              <div
                key={step.step}
                className="bg-[#FAFAFC] rounded-2xl border border-slate-200/80 p-6 space-y-3 relative overflow-hidden"
              >
                <span className="font-mono text-3xl font-extrabold text-indigo-600/30 block">
                  {step.step}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-14 sm:py-20 bg-[#FAFAFC] border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <SectionTag>FREQUENTLY ASKED QUESTIONS</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
              Common Questions About Our Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Clear answers to help you choose the right level of support.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Closing CTA Banner ── */}
      <NewCtaSection />
    </main>
  );
}

