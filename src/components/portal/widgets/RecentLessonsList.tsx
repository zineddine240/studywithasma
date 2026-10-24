import { Clock, PlayCircle } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { StatusBadge } from "../shared/StatusBadge";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export async function RecentLessonsList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    .from("recorded_lessons")
    .select(`
      id, title, duration, created_at, course_id,
      module:modules(name)
    `)
    .order("created_at", { ascending: false })
    .limit(3);

  if (enrolledCourseId) {
    const moduleFilter = moduleIds.length > 0 ? `module_id.in.(${moduleIds.join(',')})` : 'module_id.is.null';
    query.or(`course_id.eq.${enrolledCourseId},${moduleFilter}`);
  }

  const { data: recentLessons } = await query;

  if (!recentLessons || recentLessons.length === 0) {
    return null;
  }

  let progressMap = new Map();
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id, is_completed, progress_percent")
      .eq("student_id", user.id);

    if (progress) {
      progress.forEach((p) => progressMap.set(p.lesson_id, p));
    }
  }

  return (
    <PortalCard>
      <div className="flex items-center justify-between mb-4">
        <SectionHeader
          title="Recently Added Lessons"
          icon={<Clock className="w-5 h-5" />}
        />
        <Link
          href="/student-portal/recorded-lessons"
          className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {recentLessons.map((lesson) => {
          const p = progressMap.get(lesson.id);
          let status = "Not Started";
          if (p) {
            if (p.is_completed) status = "Completed";
            else if (p.progress_percent > 0) status = "In Progress";
          }

          const moduleName = lesson.module
            ? Array.isArray(lesson.module)
              ? lesson.module[0].name
              : (lesson.module as any).name
            : "General";

          return (
            <Link
              key={lesson.id}
              href={`/student-portal/recorded-lessons/${lesson.id}`}
              className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group bg-card"
            >
              <div className="relative w-24 aspect-video bg-muted/50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                <PlayCircle className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-primary bg-muted/30 px-2 py-0.5 rounded uppercase tracking-wide border border-border truncate">
                    {moduleName}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {lesson.duration || "45 min"}
                  </span>
                </div>
                <h4 className="font-bold text-foreground text-sm mb-2 truncate group-hover:text-primary transition-colors">
                  {lesson.title}
                </h4>
                <StatusBadge status={status as any} />
              </div>
            </Link>
          );
        })}
      </div>
    </PortalCard>
  );
}
