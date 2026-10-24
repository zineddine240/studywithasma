import { Calendar, Clock, Video, User, FileText, ExternalLink } from "lucide-react";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { StatusBadge, StatusType } from "@/components/portal/shared/StatusBadge";

interface ClassDetailsProps {
  classData: {
    title: string;
    description: string | null;
    scheduled_at: string;
    meeting_link: string;
    module_name?: string;
    course_name?: string;
  };
}

export function ClassDetailsCard({ classData }: ClassDetailsProps) {
  if (!classData) return null;

  const dateObj = new Date(classData.scheduled_at);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <PortalCard className="bg-card border-border">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-primary bg-muted/30 px-2.5 py-1 rounded-md border border-border uppercase tracking-wide">
              {classData.module_name || 'General'}
            </span>
            <StatusBadge status="Upcoming" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">{classData.title}</h2>
          <p className="text-muted-foreground font-medium text-sm">Course: {classData.course_name || 'General'}</p>
        </div>

        <a
          href={classData.meeting_link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-primary/80 transition-colors shrink-0"
        >
          Join Class
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Date</p>
            <p className="text-sm font-bold text-foreground">{dateStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Time</p>
            <p className="text-sm font-bold text-foreground">{timeStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border">
          <Video className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Platform</p>
            <p className="text-sm font-bold text-foreground">Online Meeting</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border">
          <User className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Teacher</p>
            <p className="text-sm font-bold text-foreground">Asma</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-foreground mb-2">Class Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{classData.description || 'No description provided.'}</p>
        </div>
      </div>
    </PortalCard>
  );
}
