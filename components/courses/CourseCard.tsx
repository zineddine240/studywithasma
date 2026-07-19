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
    <div className="bg-card rounded-2xl border border-border transition-all overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Header */}
      <div className="bg-muted/30 p-6 sm:p-8 border-b border-border">
        <div className="flex items-center justify-between mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-primary">
            <Users className="w-3.5 h-3.5" />
            {badge}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers className="w-3.5 h-3.5" />
            {moduleCount} {moduleCount === 1 ? "module" : "modules"}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{shortDescription}</p>
      </div>

      {/* Footer */}
      <div className="p-6 sm:p-8 mt-auto flex flex-col sm:flex-row gap-3">
        <Link
          href={`/courses/${slug}`}
          className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors text-center text-sm flex items-center justify-center gap-2"
        >
          View Course
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={`/request-access?course=${slug}`}
          className="flex-1 bg-muted/50 text-foreground border border-border px-6 py-3 rounded-full font-semibold hover:bg-secondary hover:border-border transition-colors text-center text-sm"
        >
          Request Access
        </Link>
      </div>
    </div>
  );
}

