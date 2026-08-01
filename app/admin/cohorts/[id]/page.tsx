import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Users, Edit, ArrowLeft, Video, Link as LinkIcon } from "lucide-react";
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

export default async function CohortDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") redirect("/");

  // Fetch cohort details
  const { data: cohort, error: cohortError } = await supabase
    .from("cohorts")
    .select(`
      *,
      course:courses(title),
      schedules:cohort_schedules(*)
    `)
    .eq("id", params.id)
    .single();

  if (cohortError || !cohort) redirect("/admin/cohorts");

  // Fetch enrolled students
  const { data: assignments, error: assignmentsError } = await supabase
    .from("student_cohort_assignments")
    .select(`
      id,
      status,
      assigned_at,
      student:profiles(id, full_name, email)
    `)
    .eq("cohort_id", cohort.id)
    .order("assigned_at", { ascending: false });

  const enrolledCount = assignments?.filter(a => a.status === 'active').length || 0;
  const fillPercentage = Math.min(100, Math.round((enrolledCount / cohort.max_students) * 100));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/cohorts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            {cohort.name}
            <Badge variant={cohort.status === 'open' ? 'default' : cohort.status === 'full' ? 'destructive' : 'secondary'} className="capitalize">
              {cohort.status}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {cohort.course?.title} • Starts {format(new Date(cohort.start_date), "MMM d, yyyy")}
          </p>
        </div>
        <Link href={`/admin/cohorts/${cohort.id}/edit`}>
          <Button variant="outline" className="font-bold flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Group
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Capacity Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Capacity
            </h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-extrabold text-foreground">{enrolledCount}</span>
              <span className="text-sm text-muted-foreground font-medium mb-1">/ {cohort.max_students} students</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${fillPercentage >= 100 ? 'bg-red-500' : fillPercentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
            {cohort.max_students - enrolledCount <= 0 && (
              <p className="text-xs text-red-500 mt-2 font-medium">Group is at maximum capacity.</p>
            )}
          </div>

          {/* Schedule Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Schedule
            </h3>
            {cohort.schedules && cohort.schedules.length > 0 ? (
              <ul className="space-y-3">
                {cohort.schedules.map((schedule: any) => (
                  <li key={schedule.id} className="flex justify-between items-center text-sm">
                    <span className="font-bold">{schedule.day_of_week}</span>
                    <span className="text-muted-foreground">{schedule.start_time} - {schedule.end_time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No schedule defined.</p>
            )}
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <div className="text-xs font-medium text-muted-foreground">Timezone: {cohort.timezone}</div>
              {cohort.google_meet_url && (
                <div className="flex items-center gap-2 text-sm text-primary font-medium mt-2">
                  <Video className="w-4 h-4" />
                  <a href={cohort.google_meet_url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                    Google Meet Link <LinkIcon className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Students List */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">Enrolled Students</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No students enrolled yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments?.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{(assignment.student as any)?.full_name || "Unknown"}</TableCell>
                      <TableCell className="text-muted-foreground">{(assignment.student as any)?.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(assignment.assigned_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                          {assignment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
