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
  PlayCircle
} from "lucide-react";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import { StatusBadge } from "@/components/portal/shared/StatusBadge";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { VideoPlayer } from "@/components/portal/recorded-lessons/VideoPlayer";
import { createClient } from "@/utils/supabase/server";

export default async function LiveClassPlaybackPage({
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

  // Fetch current live class
  const { data: liveClass, error } = await supabase
    .from("live_classes")
    .select(
      `
      *,
      module:modules(name)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !liveClass || !liveClass.recording_url) {
    notFound();
  }

  // Fetch adjacent classes ordered by scheduled_at ascending to find prev/next.
  const { data: allClasses } = await supabase
    .from("live_classes")
    .select("id, title")
    .not('recording_url', 'is', null)
    .order("scheduled_at", { ascending: true });

  let prevClass = null;
  let nextClass = null;
  if (allClasses) {
    const currentIndex = allClasses.findIndex((l) => l.id === id);
    if (currentIndex > 0) prevClass = allClasses[currentIndex - 1];
    if (currentIndex < allClasses.length - 1)
      nextClass = allClasses[currentIndex + 1];
  }

  const dateStr = new Date(liveClass.scheduled_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const moduleName = liveClass.module
    ? Array.isArray(liveClass.module)
      ? liveClass.module[0].name
      : (liveClass.module as any).name
    : "General";

  const resources: any[] = [];
  const homework: any = null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* ── Back Navigation ── */}
      <Link
        href="/student-portal/live-classes"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Live Classes
      </Link>

      {/* ── Video Player Area ── */}
      <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-border bg-card">
        <VideoPlayer videoUrl={liveClass.recording_url} />
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
              <StatusBadge status={"Completed" as any} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
              {liveClass.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-muted-foreground pb-6 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                Live Class Recording
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                Recorded: {dateStr}
              </div>
            </div>
          </div>

          {/* Description & Objectives */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                Class Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {liveClass.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            {prevClass ? (
              <Link
                href={`/student-portal/live-classes/${prevClass.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card text-card-foreground px-5 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
                    Previous Recording
                  </span>
                  <span className="block truncate max-w-37.5">
                    {prevClass.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="w-full sm:w-auto"></div>
            )}

            {nextClass ? (
              <Link
                href={`/student-portal/live-classes/${nextClass.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card text-card-foreground px-5 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors text-right"
              >
                <div className="text-right">
                  <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
                    Next Recording
                  </span>
                  <span className="block truncate max-w-37.5">
                    {nextClass.title}
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
          <PortalCard>
             <div className="text-center py-6">
               <PlayCircle className="w-12 h-12 text-primary mx-auto mb-4 opacity-80" />
               <h3 className="font-bold text-foreground">Recording Available</h3>
               <p className="text-sm text-muted-foreground mt-2">You are watching the recorded replay of this live session.</p>
             </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}
