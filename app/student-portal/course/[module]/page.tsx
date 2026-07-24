import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, PlayCircle, Video, Paperclip, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { StatusBadge, StatusType } from "@/components/portal/shared/StatusBadge";
import { ProgressBar } from "@/components/portal/shared/ProgressBar";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const resolvedParams = await params;
  const moduleSlug = resolvedParams.module;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let courseData = null;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("enrolled_course_id").eq("id", user.id).single();
    if (profile?.enrolled_course_id) {
      const { data: c } = await supabase.from("courses").select("*").eq("id", profile.enrolled_course_id).single();
      courseData = c;
    }
  }
  if (!courseData) {
    const { data: c } = await supabase.from("courses").select("*").eq("slug", "academic-ielts").single();
    courseData = c;
  }

  // Fetch module
  const { data: moduleData, error: moduleError } = await supabase
    .from("modules")
    .select("*, course:courses(title)")
    .eq("slug", moduleSlug)
    .eq("course_id", courseData.id)
    .single();

  if (moduleError || !moduleData) {
    notFound();
  }

  // Fetch related content
  const [
    { data: lessons },
    { data: classes },
    { data: attachments }
  ] = await Promise.all([
    supabase.from("recorded_lessons").select("*").eq("module_id", moduleData.id).order("created_at", { ascending: false }),
    supabase.from("live_classes").select("*").eq("module_id", moduleData.id).order("scheduled_at", { ascending: true }),
    supabase.from("module_attachments").select("*").eq("module_id", moduleData.id).order("created_at", { ascending: false }),
  ]);

  // Fetch progress for lessons if user is logged in
  let progressMap = new Map();
  if (user && lessons && lessons.length > 0) {
    const { data: progressData } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("student_id", user.id)
      .in("lesson_id", lessons.map(l => l.id));
      
    if (progressData) {
      progressData.forEach(p => progressMap.set(p.lesson_id, p));
    }
  }

  // Calculate overall module progress
  let completedCount = 0;
  lessons?.forEach(l => {
    if (progressMap.get(l.id)?.is_completed) {
      completedCount++;
    }
  });
  const totalLessons = lessons?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  let status: StatusType = "Not Started";
  if (progressPercent === 100) status = "Completed";
  else if (progressPercent > 0) status = "In Progress";

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 pb-12">
      {/* ── Module Header ── */}
      <PortalCard className="bg-card text-card-foreground border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-start gap-4">
          <Link
            href="/student-portal/course"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Course
          </Link>

          <div>
            <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
              Module {moduleData.number}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-foreground">
              {moduleData.name}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mb-6">
              {moduleData.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-muted/50 p-4 rounded-xl border border-border max-w-md">
              <div className="grow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-foreground">Progress</span>
                  <span className="text-xs font-bold text-primary">{progressPercent}%</span>
                </div>
                <ProgressBar progress={progressPercent} className="h-2" />
              </div>
              <StatusBadge status={status} />
            </div>
          </div>
        </div>
      </PortalCard>

      <div className="space-y-8">
        {/* ── Recorded Lessons ── */}
        <section className="space-y-4">
          <SectionHeader
            title="Recorded Lessons"
            icon={<PlayCircle className="w-5 h-5" />}
          />
          {lessons && lessons.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {lessons.map(lesson => {
                const prog = progressMap.get(lesson.id);
                let lStatus: StatusType = "Not Started";
                if (prog?.is_completed) lStatus = "Completed";
                else if (prog?.progress_percent > 0) lStatus = "In Progress";

                return (
                  <Link
                    key={lesson.id}
                    href={`/student-portal/recorded-lessons/${lesson.id}`}
                    className="block group"
                  >
                    <PortalCard className="h-full p-5 flex flex-col hover:border-primary/50 transition-colors bg-card">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {lesson.title}
                        </h3>
                        <div className="shrink-0">
                          <StatusBadge status={lStatus} />
                        </div>
                      </div>
                      <div className="mt-auto pt-4 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {lesson.duration || "45 min"}
                        </span>
                      </div>
                    </PortalCard>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border text-sm">
              No recorded lessons available for this module yet.
            </div>
          )}
        </section>

        {/* ── Live Classes ── */}
        <section className="space-y-4">
          <SectionHeader
            title="Live Classes"
            icon={<Video className="w-5 h-5" />}
          />
          {classes && classes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {classes.map(cls => (
                <PortalCard key={cls.id} className="p-5 flex flex-col bg-card">
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">
                    {cls.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(cls.scheduled_at), "MMM d, yyyy • h:mm a")}
                  </div>
                  <div className="mt-auto">
                    <a
                      href={cls.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center w-full py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Join Class
                    </a>
                  </div>
                </PortalCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border text-sm">
              No live classes scheduled for this module.
            </div>
          )}
        </section>

        {/* ── Resources & Attachments ── */}
        <section className="space-y-4">
          <SectionHeader
            title="Resources & Attachments"
            icon={<Paperclip className="w-5 h-5" />}
          />
          {attachments && attachments.length > 0 ? (
            <div className="grid gap-4">
              {attachments.map(att => (
                <a
                  key={att.id}
                  href={att.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Paperclip className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {att.title}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">
                    View
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border text-sm">
              No resources attached to this module.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
