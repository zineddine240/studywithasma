import { Layers, ChevronRight } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { StatusBadge } from "../shared/StatusBadge";
import { ProgressBar } from "../shared/ProgressBar";
import { courseModules } from "@/lib/mock/student-dashboard";
import Link from "next/link";

export function CourseModulesList() {
  return (
    <PortalCard>
      <SectionHeader title="Course Modules" icon={<Layers className="w-5 h-5" />} />
      
      <div className="mt-4 space-y-3">
        {courseModules.map((module, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#C4B5FD] hover:shadow-sm transition-all group">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-[#1E1B4B]">{module.title}</h3>
                <StatusBadge status={module.status} />
              </div>
              <p className="text-xs font-semibold text-[#64748B] mb-2">{module.lessons} Lessons</p>
              <div className="flex items-center gap-3">
                <ProgressBar progress={module.progress} className="max-w-[200px]" />
                <span className="text-xs font-semibold text-[#64748B]">{module.progress}%</span>
              </div>
            </div>
            
            <Link
              href="#"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF7FF] text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors shrink-0"
              aria-label={`Open ${module.title}`}
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
            
            {/* Mobile button */}
            <Link
              href="#"
              className="sm:hidden w-full flex items-center justify-center gap-2 bg-[#FAF7FF] text-[#7C3AED] py-2 rounded-lg text-sm font-semibold border border-[#EDE9FE]"
            >
              Open Module
            </Link>
          </div>
        ))}
      </div>
    </PortalCard>
  );
}
