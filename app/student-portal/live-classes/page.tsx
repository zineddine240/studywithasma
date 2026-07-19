import { Video, CalendarCheck, History, AlertCircle } from "lucide-react";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { ClassDetailsCard } from "@/components/portal/live-classes/ClassDetailsCard";
import { LiveClassCard } from "@/components/portal/live-classes/LiveClassCard";
import { createClient } from "@/utils/supabase/server";

export default async function LiveClassesPage() {
  const supabase = await createClient();

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
      id,
      title,
      description,
      scheduled_at,
      meeting_link,
      recording_url,
      course_id,
      course:courses(title),
      module:modules(name, course:courses(title))
    `)
    .order("scheduled_at", { ascending: true });

  if (enrolledCourseId) {
    const moduleFilter = moduleIds.length > 0 ? `module_id.in.(${moduleIds.join(',')})` : 'module_id.is.null';
    query.or(`course_id.eq.${enrolledCourseId},${moduleFilter}`);
  }

  const { data: liveClasses } = await query;

  const now = new Date();
  const upcomingClasses = [];
  const pastClasses = [];

  if (liveClasses) {
    for (const c of liveClasses) {
      const classDate = new Date(c.scheduled_at);
      const formattedDate = classDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const formattedTime = classDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      const moduleName = c.module ? (Array.isArray(c.module) ? c.module[0].name : (c.module as any).name) : "General";

      const mappedClass = {
        id: c.id,
        title: c.title,
        module: moduleName,
        date: formattedDate,
        time: formattedTime,
        platform: "Online Meeting",
        status: classDate > now ? "Upcoming" as const : "Completed" as const,
        recordingUrl: c.recording_url,
      };

      if (classDate > now) {
        upcomingClasses.push(mappedClass);
      } else {
        pastClasses.push(mappedClass);
      }
    }
  }

  // Find the next live class
  const nextClassRaw = liveClasses?.find((c) => new Date(c.scheduled_at) > now);
  const nextClassData = nextClassRaw ? {
    title: nextClassRaw.title,
    description: nextClassRaw.description,
    scheduled_at: nextClassRaw.scheduled_at,
    meeting_link: nextClassRaw.meeting_link,
    recording_url: nextClassRaw.recording_url,
    module_name: nextClassRaw.module ? (Array.isArray(nextClassRaw.module) ? nextClassRaw.module[0].name : (nextClassRaw.module as any).name) : undefined,
    course_name: nextClassRaw.course 
      ? (Array.isArray(nextClassRaw.course) ? nextClassRaw.course[0].title : (nextClassRaw.course as any).title) 
      : (nextClassRaw.module 
        ? (Array.isArray(nextClassRaw.module) ? (nextClassRaw.module[0].course as any)?.title : (nextClassRaw.module as any).course?.title)
        : "General"),
  } : null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-8">
      
      {/* ── Page Header ── */}
      <section className="text-center sm:text-left bg-muted/30 p-6 sm:p-8 rounded-2xl border border-border">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
          Live Classes
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          View your upcoming online classes and join your Google Meet or Zoom sessions.
        </p>
      </section>

      {/* ── Next Live Class ── */}
      {nextClassData && (
        <section>
          <SectionHeader title="Your Next Class" icon={<Video className="w-5 h-5" />} />
          <ClassDetailsCard classData={nextClassData} />
        </section>
      )}

      {/* ── Upcoming Classes ── */}
      {upcomingClasses.length > 0 && (
        <section>
          <SectionHeader title="Upcoming Classes" icon={<CalendarCheck className="w-5 h-5" />} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingClasses.map((c) => (
              <LiveClassCard key={c.id} {...c} />
            ))}
          </div>
        </section>
      )}

      {/* ── Past Classes ── */}
      {pastClasses.length > 0 && (
        <section>
          <SectionHeader title="Past Classes" icon={<History className="w-5 h-5" />} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastClasses.map((c) => (
              <LiveClassCard key={c.id} {...c} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
