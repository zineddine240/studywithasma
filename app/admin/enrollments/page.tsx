import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EnrollmentDashboard from "./EnrollmentDashboard";

export default async function AdminEnrollmentsPage() {
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
  const { data: requests, error } = await supabase
    .from("enrollment_requests")
    .select(`
      *,
      student:profiles ( id, full_name, email, phone, country, target_band, group_name, enrollment_expiry, is_enrolled ),
      course:courses ( id, title, badge )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching enrollment requests:", error);
  }

  // Fetch available courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, badge")
    .order("created_at", { ascending: false });

  // Fetch all registered student profiles for direct manual enrollment
  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, email, is_enrolled, enrolled_course_id, target_band, group_name")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <EnrollmentDashboard
        initialRequests={requests || []}
        courses={courses || []}
        allStudents={students || []}
      />
    </div>
  );
}
