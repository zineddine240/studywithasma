import { BookOpen } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { StatusBadge } from "../shared/StatusBadge";
import { ProgressBar } from "../shared/ProgressBar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export async function CourseModulesList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let enrolledCourseId = null;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("enrolled_course_id").eq("id", user.id).single();
    enrolledCourseId = profile?.enrolled_course_id;
  }

  const modulesQuery = supabase.from("modules").select("*").order("number", { ascending: true });
  if (enrolledCourseId) {
    modulesQuery.eq("course_id", enrolledCourseId);
  }
  const { data: modules } = await modulesQuery;

  const { data: allLessons } = await supabase.from("recorded_lessons").select("id, module_id");
  const { data: progress } = user ? await supabase.from("lesson_progress").select("*").eq("student_id", user.id) : { data: [] };

  const progressMap = new Map((progress || []).map(p => [p.lesson_id, p]));

  const courseModules = (modules || []).map(m => {
    const moduleLessons = (allLessons || []).filter(l => l.module_id === m.id);
    let completed = 0;
    moduleLessons.forEach(l => {
      if (progressMap.get(l.id)?.is_completed) completed++;
    });

    const percent = moduleLessons.length > 0 ? Math.round((completed / moduleLessons.length) * 100) : 0;
    let status = "Not Started";
    if (percent === 100) status = "Completed";
    else if (percent > 0) status = "In Progress";

    return {
      id: m.id,
      title: m.name,
      slug: m.slug,
      lessons: moduleLessons.length,
      progress: percent,
      status: status as any
    };
  });

  return (
    <PortalCard>
      <div className="flex items-center justify-between mb-4">
        <SectionHeader title="Course Modules" icon={<BookOpen className="w-5 h-5" />} />
        <Link href="/student-portal/course" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
          Course Overview
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {courseModules.map((module) => (
          <Link
            key={module.id}
            href={`/student-portal/course/${module.slug}`}
            className="flex flex-col p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group bg-card"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 pr-2">
                {module.title}
              </h4>
              <StatusBadge status={module.status} />
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-2">
                <span>{module.lessons} Lessons</span>
                <span className="text-primary">{module.progress}%</span>
              </div>
              <ProgressBar progress={module.progress} className="h-1.5" />
            </div>
          </Link>
        ))}
        {courseModules.length === 0 && (
          <p className="text-sm text-slate-500 py-4">No modules found.</p>
        )}
      </div>
    </PortalCard>
  );
}
