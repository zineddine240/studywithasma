import Link from "next/link";
import { ArrowRight, Layers, Users } from "lucide-react";
import type { CourseSummary } from "@/lib/courseData";

export default function CourseCard({
  slug,
  title,
  badge,
  shortDescription,
  moduleCount,
}: CourseSummary) {
  return (
    <div className="group bg-card rounded-[2rem] border border-border transition-all overflow-hidden flex flex-col hover:shadow-2xl hover:border-primary/50 transition-all duration-300 relative h-full">
      {/* Decorative gradient that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <div className="bg-muted/30 p-8 border-b border-border relative z-10">
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-secondary text-primary border border-primary/10">
            <Users className="w-3.5 h-3.5" />
            {badge}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background px-3 py-1.5 rounded-full border border-border">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            {moduleCount} {moduleCount === 1 ? "module" : "modules"}
          </span>
        </div>
        <h3 className="text-3xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed font-medium">{shortDescription}</p>
      </div>

      {/* Footer */}
      <div className="p-8 mt-auto flex flex-col sm:flex-row gap-4 relative z-10 bg-card">
        <Link
          href={`/courses/${slug}`}
          className="flex-1 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-bold hover:bg-primary/90 transition-all text-center text-sm flex items-center justify-center gap-2 group/btn hover:shadow-lg hover:-translate-y-0.5"
        >
          View Course
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
        <Link
          href={`/request-access?course=${slug}`}
          className="flex-1 bg-muted/50 text-foreground border border-border px-6 py-3.5 rounded-full font-bold hover:bg-secondary hover:border-border transition-all text-center text-sm hover:-translate-y-0.5"
        >
          Request Access
        </Link>
      </div>
    </div>
  );
}

