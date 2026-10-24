import { Target, CheckCircle2, FileText, BookMarked } from "lucide-react";
import { PortalCard } from "../shared/PortalCard";
import { SectionHeader } from "../shared/SectionHeader";
import { ProgressBar } from "../shared/ProgressBar";
import { createClient } from "@/utils/supabase/server";

export async function ProgressSummaryCard() {
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

  const progressQuery = supabase.from("lesson_progress").select("is_completed, lesson:recorded_lessons!inner(course_id, module_id)").eq("student_id", user.id);
  if (enrolledCourseId) {
    const moduleFilter = moduleIds.length > 0 ? `lesson.module_id.in.(${moduleIds.join(',')})` : 'lesson.module_id.is.null';
    progressQuery.or(`lesson.course_id.eq.${enrolledCourseId},${moduleFilter}`);
  }
  const { data: progress } = await progressQuery;
  const lessonsCompleted = progress?.filter(p => p.is_completed).length || 0;

  const totalLessonsQuery = supabase.from("recorded_lessons").select("id", { count: 'exact', head: true });
  if (enrolledCourseId) {
    const moduleFilter = moduleIds.length > 0 ? `module_id.in.(${moduleIds.join(',')})` : 'module_id.is.null';
    totalLessonsQuery.or(`course_id.eq.${enrolledCourseId},${moduleFilter}`);
  }
  const { count: totalLessons } = await totalLessonsQuery;

  const courseProgress = (totalLessons || 0) > 0 ? Math.round((lessonsCompleted / (totalLessons as number)) * 100) : 0;

  return (
    <PortalCard>
      <SectionHeader title="Your Progress" icon={<Target className="w-5 h-5" />} />
      
      <div className="mt-4 space-y-4">
        <div className="bg-muted/50 p-4 rounded-xl border border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">Overall Course</span>
            <span className="text-sm font-bold text-primary">{courseProgress}%</span>
          </div>
          <ProgressBar progress={courseProgress} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <BookMarked className="w-4 h-4 text-primary" />
              Total Lessons
            </div>
            <span className="text-sm font-bold text-foreground">{totalLessons || 0}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
            <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-900 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Completed
            </div>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{lessonsCompleted}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <FileText className="w-4 h-4 text-primary" />
              Assignments
            </div>
            <span className="text-sm font-bold text-foreground">0</span>
          </div>
        </div>
      </div>
    </PortalCard>
  );
}
