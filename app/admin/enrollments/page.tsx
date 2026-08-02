import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EnrollmentDashboard from "./EnrollmentDashboard";
import { getPagination, getTotalPages } from "@/lib/utils/pagination";

export default async function AdminEnrollmentsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const { from, to, limit } = getPagination(page, 10);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    redirect("/");
  }

  // Fetch enrollment requests with related profiles and courses
  const { data: requests, error, count } = await supabase
    .from("enrollment_requests")
    .select(`
      *,
      student:profiles ( id, full_name, email, phone, country, target_band, group_name, enrollment_expiry, is_enrolled ),
      course:courses ( id, title, badge )
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching enrollment requests:", JSON.stringify(error, null, 2));
  }

  const totalPages = getTotalPages(count, limit);

  // Fetch available courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, badge")
    .order("created_at", { ascending: false });

  // Fetch cohorts for the assignment dropdown
  const { data: allCohorts } = await supabase
    .from("cohorts")
    .select("id, name, course_id, max_students, status")
    .in("status", ["open", "active"])
    .order("start_date", { ascending: true });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <EnrollmentDashboard
        initialRequests={requests || []}
        courses={courses || []}
        allCohorts={allCohorts || []}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
