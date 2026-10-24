"use client";

import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { SectionTag } from "@/components/ui/section-tag";

export type Testimonial = {
  id?: string;
  name: string;
  band?: string | null;
  text: string;
  role?: string | null;
};

export default function TestimonialsSection({
  testimonials = [],
}: {
  testimonials?: Testimonial[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const cards = cardsContainerRef.current?.children;
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [testimonials] },
  );

  // If no testimonials have been published from the admin dashboard yet, do not render the section
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-background relative overflow-hidden"
      id="testimonials"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 ">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <SectionTag>TESTIMONIALS</SectionTag>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-foreground tracking-tight">
            What Our Students Say
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Real feedback from candidates who transformed their English
            proficiency and unlocked international admissions.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div
          ref={cardsContainerRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((t, i) => (
            <div
              key={t.id || i}
              className="group bg-card rounded-3xl border border-border/80 p-8 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between relative"
            >
              <div className="absolute top-6 right-6 text-primary/15 group-hover:text-primary/25 transition-colors">
                <Quote className="w-8 h-8 rotate-180" />
              </div>

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-foreground/90 font-medium text-base leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                    {(t.name || "S").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {t.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t.role || "IELTS Candidate"}
                    </p>
                  </div>
                </div>

                {t.band && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    Band {t.band}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
