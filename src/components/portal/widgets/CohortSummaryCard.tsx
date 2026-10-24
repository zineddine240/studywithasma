import { Users, Calendar, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function CohortSummaryCard({ cohort }: { cohort: any }) {
  if (!cohort) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-2">Group Access</h3>
        <p className="text-sm text-muted-foreground">
          No group has been assigned to your account yet. Please contact your instructor.
        </p>
      </div>
    );
  }

  const primarySchedule = cohort.schedules?.[0];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-wider text-primary border-primary/20">
            {cohort.course?.title || cohort.course_type}
          </Badge>
          <h2 className="text-xl font-extrabold tracking-tight">Welcome to {cohort.name}</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="font-medium text-xs">
              {cohort.status}
            </Badge>
            Starts {format(new Date(cohort.start_date), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        {primarySchedule ? (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Study Days
              </span>
              <span className="text-sm font-semibold">{primarySchedule.day_of_week}s</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Time
              </span>
              <span className="text-sm font-semibold">{primarySchedule.start_time} - {primarySchedule.end_time}</span>
            </div>
          </>
        ) : (
          <div className="col-span-2 text-sm text-muted-foreground">Schedule not defined yet.</div>
        )}
      </div>
    </div>
  );
}
