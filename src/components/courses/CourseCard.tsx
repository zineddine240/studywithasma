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
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-indigo-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full p-6 sm:p-8">
      {/* Top badges & Title */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Users className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/80">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {moduleCount} {moduleCount === 1 ? "module" : "modules"}
            </span>
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#0B1536] mb-3 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
          {shortDescription}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
        <Link
          href={`/courses/${slug}`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#E58F00] text-slate-950 font-bold px-5 py-3 rounded-full text-xs sm:text-sm shadow-xs transition-colors"
        >
          <span>View Course</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </Link>
        <Link
          href={`/request-access?course=${slug}`}
          className="flex-1 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold px-5 py-3 rounded-full text-xs sm:text-sm transition-colors"
        >
          <span>Request Access</span>
        </Link>
      </div>
    </div>
  );
}
