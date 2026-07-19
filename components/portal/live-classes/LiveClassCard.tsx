import {
  Calendar,
  Clock,
  Video,
  Info,
  PlayCircle,
  FolderOpen,
} from "lucide-react";
import {
  StatusBadge,
  StatusType,
} from "@/components/portal/shared/StatusBadge";
import Link from "next/link";

interface LiveClassCardProps {
  title: string;
  module: string;
  date: string;
  time?: string;
  platform?: string;
  status: StatusType;
  message?: string;
  recordingUrl?: string;
  id?: string;
}

export function LiveClassCard({
  title,
  module,
  date,
  time,
  platform,
  status,
  message,
  recordingUrl,
  id,
}: LiveClassCardProps) {
  const isPast = status === "Completed";
  const isAlert = status === "Cancelled" || status === "Rescheduled";

  return (
    <div
      className={`flex flex-col p-5 rounded-2xl border transition-all ${
        isAlert
          ? "bg-red-50/30 border-red-100 dark:bg-red-950/20 dark:border-red-900/50"
          : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start gap-3 mb-3">
        <span className="text-xs font-bold text-primary bg-muted/30 px-2 py-1 rounded-md border border-border uppercase tracking-wide">
          {module}
        </span>
        <StatusBadge status={status} />
      </div>

      <h3 className="font-bold text-foreground text-lg mb-4 grow line-clamp-2">
        {title}
      </h3>

      <div className="space-y-2 text-sm font-medium text-muted-foreground mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          {date}
        </div>
        {time && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {time}
          </div>
        )}
        {platform && (
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />
            {platform}
          </div>
        )}
      </div>

      {message && (
        <div
          className={`flex items-start gap-2 p-3 rounded-xl mb-4 text-sm font-medium ${
            status === "Cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{message}</p>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
        {isPast ? (
          <>
            <Link
              href="#"
              className="flex-1 flex items-center justify-center gap-2 bg-muted/30 text-primary py-2 rounded-xl text-sm font-bold border border-border hover:bg-secondary transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Materials
            </Link>
            {recordingUrl && (
              <Link
                href={`/student-portal/live-classes/${id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-card text-card-foreground py-2 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors focus:outline-hidden"
              >
                <PlayCircle className="w-4 h-4 text-primary" />
                Recording
              </Link>
            )}
          </>
        ) : (
          <button className="w-full flex items-center justify-center gap-2 bg-muted/30 text-primary py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-secondary transition-colors">
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
