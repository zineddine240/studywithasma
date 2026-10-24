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
    topicSummary: content.passage ? (content.passage.length > 120 ? content.passage.slice(0, 120) + "..." : content.passage) : "Writing Practice",
    recommendedTime: content.duration_minutes || content.recommendedTime || 60,
    parts: content.parts && content.parts.length > 0 ? content.parts : [{
      title: "Task 1",
      prompt: content.passage || "No prompt provided.",
      instructions: content.instructions || "",
      imageUrl: content.imageUrl || "",
      minWords: content.minWords || 150,
    }],
  };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-full">
      <WritingTestEditor test={formattedTest} userId={user.id} />
    </div>
  );
}
