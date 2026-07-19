import {
  BookOpen,
  Target,
  CheckCircle2,
  FileText,
  ArrowRight,
  BookMarked,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { StatusBadge } from "@/components/portal/shared/StatusBadge";
import { ProgressBar } from "@/components/portal/shared/ProgressBar";
import { createClient } from "@/utils/supabase/server";

export default async function MyCoursePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = p;
  }

  // Fetch course (fallback to academic-ielts if none enrolled)
  let courseData = null;
  if (profile?.enrolled_course_id) {
    const { data: c } = await supabase
      .from("courses")
      .select("*")
      .eq("id", profile.enrolled_course_id)
      .single();
    courseData = c;
  }
  if (!courseData) {
    const { data: c } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", "academic-ielts")
      .single();
    courseData = c;
  }

  // Fetch modules
  let modules: any[] = [];
  if (courseData) {
    const { data: m } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseData.id)
      .order("number", { ascending: true });
    modules = m || [];
  }

  // Fetch all recorded lessons for this course's modules to count them
  const moduleIds = modules.map((m) => m.id);
  const { data: lessons } =
    moduleIds.length > 0
      ? await supabase
          .from("recorded_lessons")
          .select("id, module_id, title")
          .in("module_id", moduleIds)
      : { data: [] };

  // Fetch user's progress
  const { data: progress } = user
    ? await supabase
        .from("lesson_progress")
        .select("*")
        .eq("student_id", user.id)
    : { data: [] };

  const progressMap = new Map((progress || []).map((p) => [p.lesson_id, p]));

  // Calculate statistics
  const totalLessons = lessons?.length || 0;
  let lessonsCompleted = 0;

  // Build module stats
  const mappedModules = modules.map((m) => {
    const moduleLessons = lessons?.filter((l) => l.module_id === m.id) || [];
    let completedInModule = 0;
    moduleLessons.forEach((l) => {
      const p = progressMap.get(l.id);
      if (p?.is_completed) {
        completedInModule++;
        lessonsCompleted++;
      }
    });

    const moduleProgress =
      moduleLessons.length > 0
        ? Math.round((completedInModule / moduleLessons.length) * 100)
        : 0;
    let status = "Not Started";
    if (moduleProgress === 100) status = "Completed";
    else if (moduleProgress > 0) status = "In Progress";

    return {
      title: `Module ${m.number}: ${m.name}`,
      slug: m.slug,
      description: m.description,
      lessonsCount: moduleLessons.length,
      progress: moduleProgress,
      status: status as any,
    };
  });

  const courseProgress =
    totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

  const targetBand = profile?.target_band || "6.5";
  const group = profile?.group_name || "Self-Paced";
  const courseTitle = courseData?.title || "IELTS Preparation";

  // Find something to "Continue Learning"
  let continueLearning = null;
  if (lessons && progress) {
    // find a lesson that has progress but not completed
    const inProgress = progress.find(
      (p) => p.progress_percent > 0 && !p.is_completed,
    );
    if (inProgress) {
      const lesson = lessons.find((l) => l.id === inProgress.lesson_id);
      if (lesson) {
        const mod = modules.find((m) => m.id === lesson.module_id);
        continueLearning = {
          module: mod ? mod.name : "Module",
          lesson: lesson.title,
          slug: mod?.slug || "introduction",
        };
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
      {/* ── Course Header ── */}
      <PortalCard className="bg-card text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative z-10">
          <div className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            {courseTitle}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {courseTitle}
          </h1>
          <p className="text-primary/70 text-sm sm:text-base mb-6 max-w-2xl">
            {courseData?.short_description ||
              "Prepare through structured lessons."}
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
            <div>
              <p className="text-xs text-primary/70 mb-0.5 uppercase tracking-wider font-semibold">
                Group
              </p>
              <p className="font-bold text-sm">{group}</p>
            </div>
            <div>
              <p className="text-xs text-primary/70 mb-0.5 uppercase tracking-wider font-semibold">
                Target Band
              </p>
              <p className="font-bold text-sm">{targetBand}</p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Overall Progress</span>
              <span className="font-bold">{courseProgress}%</span>
            </div>
            <ProgressBar
              progress={courseProgress}
              className="bg-white/20 h-2"
            />
          </div>
        </div>
      </PortalCard>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-6 lg:gap-8">
        {/* ── Main Column ── */}
        <div className="space-y-6 lg:space-y-8">
          {/* Modules List */}
          <PortalCard>
            <SectionHeader
              title="Course Modules"
              icon={<BookOpen className="w-5 h-5" />}
            />

            <div className="mt-4 space-y-4">
              {mappedModules.map((module) => (
                <div
                  key={module.slug}
                  className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-border hover:border-primary/50 hover:shadow-sm transition-all group bg-card"
                >
                  <div className="grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {module.title}
                      </h3>
                      <StatusBadge status={module.status} />
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {module.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <BookMarked className="w-4 h-4 text-primary" />
                        {module.lessonsCount} Lessons
                      </div>
                      <div className="flex items-center gap-2 grow max-w-37.5">
                        <ProgressBar
                          progress={module.progress}
                          className="h-1.5"
                        />
                        <span className="text-xs font-semibold text-muted-foreground w-8 text-right">
                          {module.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:self-center mt-4 sm:mt-0 shrink-0">
                    <Link
                      href={`/student-portal/course/${module.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-muted/30 text-primary px-5 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-secondary transition-colors"
                    >
                      Open Module
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
              {mappedModules.length === 0 && (
                <p className="text-sm text-slate-500 py-4">
                  No modules found for this course.
                </p>
              )}
            </div>
          </PortalCard>
        </div>

        {/* ── Side Column ── */}
        <div className="space-y-6 lg:space-y-8">
          {/* Course Statistics */}
          <PortalCard>
            <SectionHeader
              title="Course Statistics"
              icon={<Target className="w-5 h-5" />}
            />

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Modules
                </div>
                <span className="text-sm font-bold text-foreground">
                  {modules.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                  <BookMarked className="w-4 h-4 text-primary" />
                  Total Lessons
                </div>
                <span className="text-sm font-bold text-foreground">
                  {totalLessons}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-900 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Lessons Completed
                </div>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {lessonsCompleted}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  Assignments
                </div>
                <span className="text-sm font-bold text-foreground">0</span>
              </div>
            </div>
          </PortalCard>

          {/* Continue Learning */}
          {continueLearning && (
            <PortalCard>
              <SectionHeader
                title="Continue Learning"
                icon={<PlayCircle className="w-5 h-5" />}
              />

              <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">
                  {continueLearning.module}
                </p>
                <h3 className="font-bold text-foreground mb-4">
                  {continueLearning.lesson}
                </h3>

                <Link
                  href={`/student-portal/course/${continueLearning.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary/80 transition-colors shadow-sm"
                >
                  Continue Lesson
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </PortalCard>
          )}
        </div>
      </div>
    </div>
  );
}
