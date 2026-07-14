import { PlayCircle, Clock, Calendar } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { StatusBadge } from "../shared/StatusBadge";
import { recentLessons } from "@/lib/mock/student-dashboard";
import Link from "next/link";

export function RecentLessonsList() {
  return (
    <PortalCard>
      <SectionHeader title="Recent Recorded Lessons" icon={<PlayCircle className="w-5 h-5" />} />
      
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentLessons.map((lesson) => (
          <div key={lesson.id} className="flex flex-col p-4 rounded-xl border border-[#E5E7EB] hover:border-[#C4B5FD] hover:shadow-sm transition-all">
            <div className="flex justify-between items-start gap-2 mb-2">
              <span className="text-xs font-bold text-[#7C3AED] bg-[#FAF7FF] px-2 py-1 rounded-md border border-[#EDE9FE]">
                {lesson.module}
              </span>
              <StatusBadge status={lesson.status} />
            </div>
            
            <h3 className="font-bold text-[#1E1B4B] text-sm mb-3 flex-grow line-clamp-2">
              {lesson.title}
            </h3>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B] mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lesson.duration}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {lesson.publishedDate}
              </div>
            </div>
            
            <Link
              href="#"
              className="mt-auto w-full flex items-center justify-center gap-2 bg-[#FAF7FF] text-[#7C3AED] py-2 rounded-lg text-sm font-bold border border-[#EDE9FE] hover:bg-[#EDE9FE] transition-colors"
            >
              Watch Lesson
            </Link>
          </div>
        ))}
      </div>
    </PortalCard>
  );
}
