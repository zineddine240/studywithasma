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

  const { data: { user } } = await supabase.auth.getUser();

  if (error || !test || !user) {
    return notFound();
  }

  return (
    <div className="w-full h-full pb-4">
      <ReadingTestClient testData={test.content_data} title={test.title} userId={user.id} />
    </div>
  );
}
