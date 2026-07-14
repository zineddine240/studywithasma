import { PlayCircle, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/portal/shared/StatusBadge";
import { ProgressBar } from "@/components/portal/shared/ProgressBar";
import { RecordedLesson } from "@/lib/mock/recorded-lessons";
import Link from "next/link";

export function RecordedLessonCard({ lesson }: { lesson: RecordedLesson }) {
  const isCompleted = lesson.status === "Completed";
  const isInProgress = lesson.status === "In Progress";

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#C4B5FD] hover:shadow-sm transition-all overflow-hidden group">
      
      {/* Thumbnail Placeholder */}
      <Link href={`/student-portal/recorded-lessons/${lesson.id}`} className="block relative aspect-video bg-slate-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-colors">
          <PlayCircle className="w-12 h-12 text-white opacity-90 drop-shadow-md group-hover:scale-110 transition-transform" />
        </div>
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold text-[#7C3AED] bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">
            {lesson.module}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="text-xs font-bold text-white bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
            {lesson.duration}
          </span>
        </div>
        
        {/* Progress bar overlay on thumbnail if in progress */}
        {isInProgress && lesson.progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <div className="h-full bg-[#7C3AED]" style={{ width: `${lesson.progress}%` }}></div>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <StatusBadge status={lesson.status} />
          {lesson.resources.length > 0 && (
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              {lesson.resources.length} Materials
            </span>
          )}
        </div>

        <Link href={`/student-portal/recorded-lessons/${lesson.id}`}>
          <h3 className="font-bold text-[#1E1B4B] text-lg mb-3 line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
            {lesson.title}
          </h3>
        </Link>

        <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B] mb-5">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#7C3AED]" />
            {lesson.duration}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-[#7C3AED]" />
            {lesson.publishedDate}
          </div>
        </div>

        <div className="mt-auto">
          {isInProgress ? (
            <div className="mb-4">
               <div className="flex justify-between items-center text-xs font-semibold text-[#64748B] mb-2">
                 <span>Watched</span>
                 <span className="text-[#7C3AED]">{lesson.progress}%</span>
               </div>
               <ProgressBar progress={lesson.progress || 0} className="h-1.5 mb-3" />
            </div>
          ) : null}

          <Link
            href={`/student-portal/recorded-lessons/${lesson.id}`}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
                : isInProgress
                ? "bg-[#7C3AED] text-white hover:bg-[#4C1D95] shadow-sm"
                : "bg-[#FAF7FF] text-[#7C3AED] border border-[#EDE9FE] hover:bg-[#EDE9FE]"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Review Lesson
              </>
            ) : isInProgress ? (
              <>
                <PlayCircle className="w-4 h-4" />
                Continue Watching
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                Start Lesson
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
