import { Calendar, Clock, Video, Info, PlayCircle, FolderOpen } from "lucide-react";
import { StatusBadge, StatusType } from "@/components/portal/shared/StatusBadge";
import Link from "next/link";

interface LiveClassCardProps {
  title: string;
  module: string;
  date: string;
  time?: string;
  platform?: string;
  status: StatusType;
  message?: string;
  hasRecording?: boolean;
}

export function LiveClassCard({
  title,
  module,
  date,
  time,
  platform,
  status,
  message,
  hasRecording,
}: LiveClassCardProps) {
  const isPast = status === "Completed";
  const isAlert = status === "Cancelled" || status === "Rescheduled";

  return (
    <div className={`flex flex-col p-5 rounded-2xl border transition-all ${
      isAlert ? 'bg-red-50/30 border-red-100' : 'bg-white border-[#E5E7EB] hover:border-[#C4B5FD] hover:shadow-sm'
    }`}>
      <div className="flex justify-between items-start gap-3 mb-3">
        <span className="text-xs font-bold text-[#7C3AED] bg-[#FAF7FF] px-2 py-1 rounded-md border border-[#EDE9FE] uppercase tracking-wide">
          {module}
        </span>
        <StatusBadge status={status} />
      </div>

      <h3 className="font-bold text-[#1E1B4B] text-lg mb-4 flex-grow line-clamp-2">
        {title}
      </h3>

      <div className="space-y-2 text-sm font-medium text-[#64748B] mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#7C3AED]" />
          {date}
        </div>
        {time && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7C3AED]" />
            {time}
          </div>
        )}
        {platform && (
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#7C3AED]" />
            {platform}
          </div>
        )}
      </div>

      {message && (
        <div className={`flex items-start gap-2 p-3 rounded-xl mb-4 text-sm font-medium ${
          status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
        }`}>
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{message}</p>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row gap-2">
        {isPast ? (
          <>
            <Link
              href="#"
              className="flex-1 flex items-center justify-center gap-2 bg-[#FAF7FF] text-[#7C3AED] py-2 rounded-xl text-sm font-bold border border-[#EDE9FE] hover:bg-[#EDE9FE] transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Materials
            </Link>
            {hasRecording && (
              <Link
                href="/student-portal/recorded-lessons"
                className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1E1B4B] py-2 rounded-xl text-sm font-bold border border-[#E5E7EB] hover:bg-slate-50 transition-colors"
              >
                <PlayCircle className="w-4 h-4 text-[#7C3AED]" />
                Recording
              </Link>
            )}
          </>
        ) : (
          <button className="w-full flex items-center justify-center gap-2 bg-[#FAF7FF] text-[#7C3AED] py-2.5 rounded-xl text-sm font-bold border border-[#EDE9FE] hover:bg-[#EDE9FE] transition-colors">
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
