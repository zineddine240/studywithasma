"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Award,
  FileText,
  Home,
  UserCheck,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";
import { SectionTag } from "@/components/ui/section-tag";

interface ServiceCard {
  title: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
  iconBg: string;
  iconColor: string;
}

const SERVICES: ServiceCard[] = [
  {
    title: "IELTS Band Mastery",
    description:
      "Live exam preparation, speaking simulations, and examiner writing feedback.",
    href: "/ielts",
    icon: BookOpen,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    title: "University Matching",
    description:
      "Find top English-taught programs in accredited French and Italian universities.",
    href: "/destinations",
    icon: Compass,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
  {
    title: "Scholarship Guidance",
    description:
      "Apply for DSU regional grants offering €7,000 yearly living allowances and €0 tuition.",
    href: "/destinations/italy",
    icon: Award,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600",
  },
  {
    title: "Document Processing",
    description:
      "Professional drafting for Statements of Purpose and European academic CVs.",
    href: "/study-abroad",
    icon: FileText,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  {
    title: "Pre-Departure Support",
    description:
      "Assistance securing student housing, CAF subsidies, and health insurance.",
    href: "/study-abroad",
    icon: Home,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600",
  },
  {
    title: "Visa Interview Coaching",
    description:
      "1-on-1 mock interviews and dossier validation for embassy appointments.",
    href: "/contact",
    icon: UserCheck,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
];

export default function ServicePathwaysSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const cards = cardsRef.current?.children;
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-background relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Section Header (Matching Porbe's typography) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
          <SectionTag>SERVICES</SectionTag>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-foreground tracking-tight">
            Guiding Your Global Education Journey.
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            From language proficiency to visa approval, our structured services
            cover every milestone of your European academic path.
          </p>
        </div>

        {/* 6-Card Services Grid (Matching Porbe's 3x2 soft cards layout) */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group bg-card rounded-3xl border border-border/80 p-8 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Pastel Icon Circle */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${service.iconBg} ${service.iconColor} flex items-center justify-center transition-transform group-hover:scale-105 duration-200`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Read More Link */}
                <div className="pt-6 mt-6 border-t border-border/40">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors group/link"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
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
