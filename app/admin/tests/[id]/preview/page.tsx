import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ReadingTestClient from "@/app/student-portal/practice/reading/[id]/ReadingTestClient";
import { WritingTestEditor } from "@/components/portal/writing/WritingTestEditor";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Preview Test | Admin Dashboard",
};

export default async function AdminTestPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: test, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !test) {
    return notFound();
  }

  const isWriting = test.content_type === "writing";
  const content = test.content_data || {};

  const formattedWritingTest = isWriting
    ? {
        id: test.id,
        taskType: "Writing Practice" as const,
        title: test.title,
        topicSummary: content.passage ? (content.passage.length > 120 ? content.passage.slice(0, 120) + "..." : content.passage) : "Writing Practice Prompt",
        prompt: content.passage || "No prompt provided.",
        recommendedTime: content.recommendedTime || 40,
        minWords: content.minWords || 250,
      }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Top Admin Banner */}
      <div className="bg-muted border-b border-border p-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/admin/tests/${id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2 font-bold shadow-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Button>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary text-[10px] uppercase px-1.5 py-0.5 rounded-sm font-extrabold tracking-wider">Preview Mode</span>
              <h1 className="font-bold text-foreground text-sm">
                {test.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Test Container */}
      <div className="flex-1 overflow-y-auto bg-background relative">
        {isWriting ? (
          <WritingTestEditor test={formattedWritingTest as any} />
        ) : (
          <ReadingTestClient testData={test.content_data} title={test.title} />
        )}
      </div>
    </div>
  );
}
