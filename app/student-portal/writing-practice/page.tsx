import { createClient } from "@/utils/supabase/server";
import { WritingTestLibrary } from "@/components/portal/writing/WritingTestLibrary";

export const metadata = {
  title: "IELTS Writing Practice Library | Study with Asma",
  description: "Practice your IELTS Writing with instant AI correction.",
};

export default async function WritingPracticePage() {
  const supabase = await createClient();

  const { data: tests, error } = await supabase
    .from("tests")
    .select("id, title, content_type, content_data, created_at")
    .eq("content_type", "writing")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching writing tests:", error);
  }

  return (
    <div className="w-full h-full flex flex-col max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
          Writing Practice Library
        </h1>
        <p className="text-muted-foreground">
          Select a writing test configured by your teacher or admin, write your response, and receive instant AI feedback.
        </p>
      </div>

      <WritingTestLibrary initialTests={tests || []} />
    </div>
  );
}
