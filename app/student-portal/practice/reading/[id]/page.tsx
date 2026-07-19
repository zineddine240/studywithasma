import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ReadingTestClient from "./ReadingTestClient";

export const metadata = {
  title: "Reading Practice | Study with Asma",
};

export default async function ReadingTestPage({
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
    .eq("content_type", "reading")
    .single();

  if (error || !test) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
      <ReadingTestClient testData={test.content_data} title={test.title} />
    </div>
  );
}
