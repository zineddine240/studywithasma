import { createClient } from "@/utils/supabase/server";
import SpeakingPracticeClient from "./SpeakingPracticeClient";

export const dynamic = "force-dynamic";

export default async function SpeakingPracticePage() {
  const supabase = await createClient();
  
  // Fetch speaking tests from the database
  const { data: tests, error } = await supabase
    .from("tests")
    .select("*")
    .eq("content_type", "speaking")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching speaking tests:", error);
  }

  // Format tests for the client component
  const formattedTests = (tests || []).map(test => ({
    id: test.id,
    title: test.title,
    parts: (test.content_data?.parts || []).map((part: any, index: number) => ({
      title: part.title || `Part ${index + 1}`,
      questions: part.questions || []
    }))
  }));

  return (
    <SpeakingPracticeClient tests={formattedTests} />
  );
}
