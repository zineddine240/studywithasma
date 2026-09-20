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

  // Transform the database structure into the format expected by the client component
  const practiceTypes: string[] = [];
  const questionsRecord: Record<string, string[]> = {};

  if (tests && tests.length > 0) {
    tests.forEach((test) => {
      const parts = test.content_data?.parts || [];
      parts.forEach((part: any, index: number) => {
        const typeName = `${test.title} - ${part.title || `Part ${index + 1}`}`;
        practiceTypes.push(typeName);
        questionsRecord[typeName] = part.questions || [];
      });
    });
  }

  return (
    <SpeakingPracticeClient 
      practiceTypes={practiceTypes} 
      questions={questionsRecord} 
    />
  );
}
