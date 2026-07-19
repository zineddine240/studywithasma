import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  UploadCloud,
} from "lucide-react";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { StatusBadge } from "@/components/portal/shared/StatusBadge";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { VideoPlayer } from "@/components/portal/recorded-lessons/VideoPlayer";
import { createClient } from "@/utils/supabase/server";
import { MarkCompletedButton } from "@/components/portal/recorded-lessons/MarkCompletedButton";

export default async function RecordedLessonDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch current lesson
  const { data: lesson, error } = await supabase
    .from("recorded_lessons")
    .select(
      `
      *,
      module:modules(name)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !lesson) {
    notFound();
  }

  // Fetch adjacent lessons ordered by created_at ascending to find prev/next.
  const { data: allLessons } = await supabase
    .from("recorded_lessons")
    .select("id, title")
    .order("created_at", { ascending: true });

  let prevLesson = null;
  let nextLesson = null;
  if (allLessons) {
    const currentIndex = allLessons.findIndex((l) => l.id === id);
    if (currentIndex > 0) prevLesson = allLessons[currentIndex - 1];
    if (currentIndex < allLessons.length - 1)
      nextLesson = allLessons[currentIndex + 1];
  }

  // Check progress
  let isCompleted = false;
  let status = "Not Started";
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("is_completed, progress_percent")
      .eq("student_id", user.id)
      .eq("lesson_id", id)
      .single();

    if (progress) {
      if (progress.is_completed) {
        isCompleted = true;
        status = "Completed";
      } else if (progress.progress_percent > 0) {
        status = "In Progress";
      }
    }
  }

  const createdDate = new Date(lesson.created_at);
  const dateStr = createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const moduleName = lesson.module
    ? Array.isArray(lesson.module)
      ? lesson.module[0].name
      : (lesson.module as any).name
    : "General";

  const resources: any[] = [];
  const homework: any = null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* ── Back Navigation ── */}
      <Link
        href="/student-portal/recorded-lessons"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Recorded Lessons
      </Link>

      {/* ── Video Player Area ── */}
      <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-border bg-card">
        <VideoPlayer videoUrl={lesson.video_url} />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-6 lg:gap-8 pt-4">
        {/* ── Main Content ── */}
        <div className="space-y-8">
          {/* Lesson Header Info */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-bold text-primary bg-muted/30 px-2.5 py-1 rounded-md border border-border uppercase tracking-wide">
                {moduleName}
              </span>
              <StatusBadge status={status as any} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
              {lesson.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-muted-foreground pb-6 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {lesson.duration || "45 min"}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                Published: {dateStr}
              </div>
            </div>
          </div>

          {/* Description & Objectives */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                Lesson Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {lesson.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            {prevLesson ? (
              <Link
                href={`/student-portal/recorded-lessons/${prevLesson.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card text-card-foreground px-5 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
                    Previous
                  </span>
                  <span className="block truncate max-w-37.5">
                    {prevLesson.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="w-full sm:w-auto"></div>
            )}

            {nextLesson ? (
              <Link
                href={`/student-portal/recorded-lessons/${nextLesson.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card text-card-foreground px-5 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors text-right"
              >
                <div className="text-right">
                  <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
                    Next Lesson
                  </span>
                  <span className="block truncate max-w-37.5">
                    {nextLesson.title}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ) : (
              <div className="w-full sm:w-auto"></div>
            )}
          </div>
        </div>

        {/* ── Side Column ── */}
        <div className="space-y-6">
          <MarkCompletedButton lessonId={id} isCompleted={isCompleted} />

          {/* Resources */}
          {resources.length > 0 && (
            <PortalCard>
              <SectionHeader
                title="Resources"
                icon={<FileText className="w-5 h-5" />}
              />
              <div className="mt-4 space-y-3">
                {resources.map((res, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/50 transition-colors group bg-card"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-red-50 p-1.5 rounded-lg shrink-0">
                        <FileText className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-sm font-semibold text-foreground truncate">
                        {res.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted/30 rounded-md transition-colors"
                        title="View"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted/30 rounded-md transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </PortalCard>
          )}

          {/* Homework */}
          {homework && (
            <PortalCard>
              <SectionHeader
                title="Homework"
                icon={<UploadCloud className="w-5 h-5" />}
              />
              <div className="mt-2">
                <h4 className="font-bold text-foreground mb-2">
                  {homework.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {homework.instructions}
                </p>
                <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 mb-4 text-xs font-bold text-red-700 flex justify-center">
                  Due: {homework.dueDate}
                </div>
                <Link
                  href="/student-portal/homework"
                  className="w-full flex items-center justify-center gap-2 bg-card text-card-foreground py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  Submit Homework
                </Link>
              </div>
            </PortalCard>
          )}
        </div>
      </div>
    </div>
  );
}
