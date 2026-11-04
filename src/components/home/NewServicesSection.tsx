"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  PenTool,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const SERVICES: ServiceItem[] = [
  {
    title: "IELTS Preparation",
    description: "Structured lessons, live classes and band 7.5+ strategies.",
    icon: BookOpen,
    href: "/courses",
  },
  {
    title: "Initial Consultation",
    description: "Discuss your goals, profile and eligibility.",
    icon: Users,
    href: "/contact",
  },
  {
    title: "University Selection",
    description:
      "Get a personalized list of suitable universities and programs.",
    icon: Search,
    href: "/study-abroad",
  },
  {
    title: "Document Guidance",
    description:
      "Receive a clear checklist and review of your application documents.",
    icon: FileText,
    href: "/study-abroad",
  },
  {
    title: "Motivation Letter Support",
    description: "Guidance and feedback to make your letter stand out.",
    icon: PenTool,
    href: "/contact",
  },
  {
    title: "Application Guidance",
    description:
      "A step-by-step plan to submit your application successfully.",
    icon: ShieldCheck,
    href: "/contact",
  },
];

export default function NewServicesSection() {
  return (
    <section id="services" className="py-12 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-2 mb-8 sm:mb-10 text-center sm:text-left">
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-600">
            OUR SERVICES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1536] tracking-tight">
            How We Can Help You
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            We offer a range of services to support you at every stage of your
            study abroad journey.
          </p>
        </div>

        {/* 6 Services Grid (Supports both wide 6-column row and responsive wrapping) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Purple Circular/Rounded Icon */}
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group-hover:gap-1.5 transition-all duration-150 cursor-pointer pt-3 border-t border-slate-100"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
