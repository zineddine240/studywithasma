import { writingTests } from "@/lib/mock/writing-tests";
import { WritingTestEditor } from "@/components/portal/writing/WritingTestEditor";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const test = writingTests.find(t => t.id === id);
  if (!test) return { title: "Test Not Found" };
  
  return {
    title: `${test.title} | IELTS Writing Practice`,
    description: test.topicSummary
  };
}

export default async function WritingTestPage({ params }: PageProps) {
  const { id } = await params;
  const test = writingTests.find(t => t.id === id);
  
  if (!test) {
    redirect("/student-portal/writing-practice");
  }

  return (
    <div className="w-full h-full min-h-screen">
      <WritingTestEditor test={test} />
    </div>
  );
}
