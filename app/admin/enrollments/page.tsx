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
      student:profiles ( full_name, email, phone, country ),
      course:courses ( title, badge )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching enrollment requests:", error);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enrollment Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage student registrations, review profiles, and approve course access.
          </p>
        </div>
      </div>

      <EnrollmentDashboard initialRequests={requests || []} />
    </div>
  );
}
