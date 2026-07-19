import { Video, ArrowRight } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { StatusBadge } from "../shared/StatusBadge";
import { SectionHeader } from "../shared/SectionHeader";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export async function NextLiveClassCard() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: { user } } = await supabase.auth.getUser();

  let enrolledCourseId = null;
  let moduleIds: string[] = [];
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("enrolled_course_id").eq("id", user.id).single();
    enrolledCourseId = profile?.enrolled_course_id;

    if (enrolledCourseId) {
      const { data: mods } = await supabase.from("modules").select("id").eq("course_id", enrolledCourseId);
      moduleIds = (mods || []).map((m) => m.id);
    }
  }

  const query = supabase
    .from("live_classes")
    .select(`
      id, title, scheduled_at, meeting_link, course_id,
      module:modules(name)
    `)
    .gt("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(1);

  if (enrolledCourseId) {
    const moduleFilter = moduleIds.length > 0 ? `module_id.in.(${moduleIds.join(',')})` : 'module_id.is.null';
    query.or(`course_id.eq.${enrolledCourseId},${moduleFilter}`);
  }

  const { data: nextLiveClass } = await query.single();

  if (!nextLiveClass) {
    return (
      <PortalCard>
        <SectionHeader title="Next Live Class" icon={<Video className="w-5 h-5" />} />
        <p className="text-sm text-slate-500 mt-4">No upcoming classes scheduled.</p>
      </PortalCard>
    );
  }

  const moduleName = nextLiveClass.module ? (Array.isArray(nextLiveClass.module) ? nextLiveClass.module[0].name : (nextLiveClass.module as any).name) : "General";
  const dateObj = new Date(nextLiveClass.scheduled_at);
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <PortalCard>
      <SectionHeader title="Next Live Class" icon={<Video className="w-5 h-5" />} />
      
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-primary bg-muted/30 px-2 py-0.5 rounded uppercase tracking-wide border border-border">
                {moduleName}
              </span>
              <StatusBadge status="Upcoming" />
            </div>
            <h3 className="font-bold text-foreground leading-tight">{nextLiveClass.title}</h3>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-3 flex justify-between items-center border border-border">
          <div className="text-sm">
            <p className="font-semibold text-foreground">{dateStr}</p>
            <p className="text-muted-foreground text-xs font-medium">{timeStr}</p>
          </div>
          <Link
            href={nextLiveClass.meeting_link}
            target="_blank"
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
          >
            <Video className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <Link
          href="/student-portal/live-classes"
          className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 w-fit transition-colors"
        >
          View all classes
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </PortalCard>
  );
}
