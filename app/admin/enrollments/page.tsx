import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EnrollmentDashboard from "./EnrollmentDashboard";
import { getPagination, getTotalPages } from "@/lib/utils/pagination";

export default async function AdminEnrollmentsPage(props: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const currentStatus = searchParams.status || "all";
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

  // Fetch database count stats across all requests
  const now = new Date();
  const nowIso = now.toISOString();

  const [
    { count: allCount },
    { count: pendingCount },
    { count: rejectedCount },
    { data: approvedRows },
  ] = await Promise.all([
    supabase.from("enrollment_requests").select("*", { count: "exact", head: true }),
    supabase.from("enrollment_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("enrollment_requests").select("*", { count: "exact", head: true }).eq("status", "rejected"),
    supabase
      .from("enrollment_requests")
      .select("id, expires_at, student:profiles(enrollment_expiry)")
      .eq("status", "approved"),
  ]);

  let approvedCount = 0;
  let expiredCount = 0;

  (approvedRows || []).forEach((req: any) => {
    const expiry = req.expires_at || req.student?.enrollment_expiry;
    if (expiry && new Date(expiry) < now) {
      expiredCount++;
    } else {
      approvedCount++;
    }
  });

  const counts = {
    all: allCount || 0,
    pending: pendingCount || 0,
    approved: approvedCount,
    expired: expiredCount,
    rejected: rejectedCount || 0,
  };

  // Fetch enrollment requests with related profiles and courses filtered by current status tab
  let query = supabase.from("enrollment_requests").select(
    `
      *,
      student:profiles ( id, full_name, email, phone, country, target_band, group_name, enrollment_expiry, is_enrolled ),
      course:courses ( id, title, badge )
    `,
    { count: "exact" }
  );

  if (currentStatus === "pending") {
    query = query.eq("status", "pending");
  } else if (currentStatus === "rejected") {
    query = query.eq("status", "rejected");
  } else if (currentStatus === "approved") {
    query = query.eq("status", "approved").or(`expires_at.is.null,expires_at.gt.${nowIso}`);
  } else if (currentStatus === "expired") {
    query = query.eq("status", "approved").not("expires_at", "is", null).lte("expires_at", nowIso);
  }

  const { data: requests, error, count: activeCount } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching enrollment requests:", JSON.stringify(error, null, 2));
  }

  const effectiveCount = activeCount ?? counts[currentStatus as keyof typeof counts] ?? 0;
  const totalPages = getTotalPages(effectiveCount, limit);

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
        counts={counts}
        currentStatus={currentStatus}
      />
    </div>
  );
}
