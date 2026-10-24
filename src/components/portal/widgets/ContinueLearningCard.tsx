import { PlayCircle, ArrowRight } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { ProgressBar } from "../shared/ProgressBar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export async function ContinueLearningCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  let enrolledCourseId = null;
  let moduleIds: string[] = [];
  const { data: profile } = await supabase.from("profiles").select("enrolled_course_id").eq("id", user.id).single();
  enrolledCourseId = profile?.enrolled_course_id;

  if (enrolledCourseId) {
    const { data: mods } = await supabase.from("modules").select("id").eq("course_id", enrolledCourseId);
    moduleIds = (mods || []).map((m) => m.id);
  }

  const query = supabase
    .from("lesson_progress")
    .select(`
      progress_percent,
      lesson:recorded_lessons!inner(id, title, course_id, module_id, module:modules(name, slug))
    `)
    .eq("student_id", user.id)
    .eq("is_completed", false)
    .gt("progress_percent", 0)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (enrolledCourseId) {
    const moduleFilter = moduleIds.length > 0 ? `lesson.module_id.in.(${moduleIds.join(',')})` : 'lesson.module_id.is.null';
    query.or(`lesson.course_id.eq.${enrolledCourseId},${moduleFilter}`);
  }

  const { data: inProgress } = await query.single();

  if (!inProgress || !inProgress.lesson) {
    return (
      <PortalCard>
        <SectionHeader title="Continue Learning" icon={<PlayCircle className="w-5 h-5" />} />
        <p className="text-sm text-slate-500 mt-4">You have no lessons in progress.</p>
      </PortalCard>
    );
  }

  const lesson = Array.isArray(inProgress.lesson) ? inProgress.lesson[0] : inProgress.lesson;
  const moduleName = lesson.module ? (Array.isArray(lesson.module) ? lesson.module[0].name : (lesson.module as any).name) : "General";

  return (
    <PortalCard>
      <SectionHeader title="Continue Learning" icon={<PlayCircle className="w-5 h-5" />} />
      
      <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
        <p className="text-[10px] font-bold text-primary mb-1.5 uppercase tracking-wide">
          {moduleName}
        </p>
        <h3 className="font-bold text-foreground mb-4 leading-snug">
          {lesson.title}
        </h3>
        
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-2">
            <span>Progress</span>
            <span className="text-primary">{inProgress.progress_percent}%</span>
          </div>
          <ProgressBar progress={inProgress.progress_percent} className="h-1.5" />
        </div>

        <Link
          href={`/student-portal/recorded-lessons/${lesson.id}`}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary/80 transition-colors"
        >
          Resume Lesson
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </PortalCard>
  );
}
