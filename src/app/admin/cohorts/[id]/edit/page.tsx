import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CohortForm from "@/components/cohorts/CohortForm";

export default async function EditCohortPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") redirect("/");

  // Fetch cohort and its schedules
  const { data: cohort, error } = await supabase
    .from("cohorts")
    .select(`
      *,
      schedules:cohort_schedules(*)
    `)
    .eq("id", params.id)
    .single();

  if (error || !cohort) redirect("/admin/cohorts");

  // Fetch courses to populate the dropdown
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CohortForm courses={courses || []} initialData={cohort} isEditing />
    </div>
  );
}
