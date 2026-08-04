import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Users, Plus, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminCohortsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") redirect("/");

  // Fetch cohorts with enrolled count
  const { data: cohorts, error } = await supabase
    .from("cohorts")
    .select(`
      *,
      course:courses(title)
    `)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching cohorts:", JSON.stringify(error, null, 2));
  }

  // We need to fetch count of enrolled students separately for now
  const cohortsWithCounts = await Promise.all((cohorts || []).map(async (cohort) => {
    const { count } = await supabase
      .from("student_cohort_assignments")
      .select("*", { count: "exact", head: true })
      .eq("cohort_id", cohort.id)
      .eq("status", "active");
    
    return {
      ...cohort,
      enrolled_count: count || 0
    };
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Groups Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage groups of students, schedules, and WhatsApp links.
          </p>
        </div>

        <Link href="/admin/cohorts/new">
          <Button className="font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Group
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cohortsWithCounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No groups found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              cohortsWithCounts.map((cohort) => (
                <TableRow key={cohort.id}>
                  <TableCell>
                    <div className="font-bold text-foreground">{cohort.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{cohort.course?.title || "No Course"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(cohort.start_date), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-sm font-medium">
                        <Users className="w-4 h-4 text-muted-foreground mr-1" />
                        {cohort.enrolled_count} / {cohort.max_students}
                      </div>
                      {cohort.max_students - cohort.enrolled_count <= 0 && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Full</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {cohort.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/admin/cohorts/${cohort.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </Link>
                      <Link href={`/admin/cohorts/${cohort.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
