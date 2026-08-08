import { createClient } from "@/utils/supabase/server";
import { WritingTestEditor } from "@/components/portal/writing/WritingTestEditor";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: test } = await supabase
    .from("tests")
    .select("id, title")
    .eq("id", id)
    .single();

  if (!test) return { title: "Test Not Found" };

  return {
    title: `${test.title} | IELTS Writing Practice`,
  };
}

export default async function WritingTestPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: test, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !test) {
    redirect("/student-portal/writing-practice");
  }

  const content = test.content_data || {};
  const formattedTest = {
    id: test.id,
    taskType: "Writing Practice" as const,
    title: test.title,
    topicSummary: content.passage ? (content.passage.length > 120 ? content.passage.slice(0, 120) + "..." : content.passage) : "Writing Practice Prompt",
    prompt: content.passage || "No prompt provided.",
    recommendedTime: content.recommendedTime || 40,
    minWords: content.minWords || 250,
  };

  return (
    <div className="w-full h-full min-h-screen">
      <WritingTestEditor test={formattedTest as any} />
    </div>
  );
}
