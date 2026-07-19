import { createClient } from "@/utils/supabase/server";
import RecordedLessonsClient from "./RecordedLessonsClient";
import { RecordedLessonData } from "@/components/portal/recorded-lessons/RecordedLessonCard";
import { StatusType } from "@/components/portal/shared/StatusBadge";

export default async function RecordedLessonsPage() {
  const supabase = await createClient();

  // Get the current user
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

  // Fetch recorded lessons with their modules
  const query = supabase
    .from("recorded_lessons")
    .select(`
      id,
      title,
      duration,
      created_at,
      course_id,
      course:courses(title),
      module:modules(name, course:courses(title))
    `)
    .order("created_at", { ascending: false });

  if (enrolledCourseId) {
    const moduleFilter = moduleIds.length > 0 ? `module_id.in.(${moduleIds.join(',')})` : 'module_id.is.null';
    query.or(`course_id.eq.${enrolledCourseId},${moduleFilter}`);
  }

  const { data: lessonsData } = await query;

  // Fetch progress for this user
  let progressMap: Record<string, any> = {};
  if (user) {
    const { data: progressData } = await supabase
      .from("lesson_progress")
      .select("lesson_id, progress_percent, is_completed")
      .eq("student_id", user.id);

    if (progressData) {
      progressData.forEach((p) => {
        progressMap[p.lesson_id] = p;
      });
    }
  }

  const mappedLessons: RecordedLessonData[] = (lessonsData || []).map((l) => {
    const p = progressMap[l.id];
    let status: StatusType = "Not Started";
    if (p) {
      if (p.is_completed) status = "Completed";
      else if (p.progress_percent > 0) status = "In Progress";
    }

    const createdDate = new Date(l.created_at);
    const dateStr = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      id: l.id,
      title: l.title,
      module: l.module ? (Array.isArray(l.module) ? l.module[0].name : (l.module as any).name) : "General",
      duration: l.duration || "45 min", // Fallback if no duration provided
      publishedDate: dateStr,
      status,
      progress: p ? p.progress_percent : 0,
      resources: [],
    };
  });

  // Determine continue watching lesson (the most recently in-progress lesson or similar)
  // For now, just pick the first one that is "In Progress"
  const continueWatchingLesson = mappedLessons.find(l => l.status === "In Progress") || null;

  return (
    <RecordedLessonsClient 
      lessons={mappedLessons} 
      continueWatchingLesson={continueWatchingLesson} 
    />
  );
}
