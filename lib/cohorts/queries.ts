"use server";

import { createClient } from "@/utils/supabase/server";
import { Cohort, CohortSchedule } from "@/lib/types/cohorts";

export async function getAvailableCohortsByCourse(courseSlug: string) {
  const supabase = await createClient();

  // First get the course ID
  const { data: course } = await supabase.from("courses").select("id").eq("slug", courseSlug).single();
  if (!course) return [];

  // We need to fetch cohorts that are open, visible, not full, and registration deadline not passed
  const { data: cohorts, error } = await supabase
    .from("cohorts")
    .select(`
      *,
      schedules:cohort_schedules(*)
    `)
    .eq("course_id", course.id)
    .eq("status", "open")
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching available cohorts:", error);
    return [];
  }

  // Calculate remaining seats for each cohort
  const availableCohorts = await Promise.all(
    cohorts.map(async (cohort) => {
      const { count } = await supabase
        .from("student_cohort_assignments")
        .select("*", { count: "exact", head: true })
        .eq("cohort_id", cohort.id)
        .eq("status", "active");

      const enrolled = count || 0;
      const remainingSeats = cohort.max_students - enrolled;

      return {
        ...cohort,
        enrolled_students_count: enrolled,
        remainingSeats,
      };
    })
  );

  return availableCohorts.filter((c) => c.remainingSeats > 0);
}

export async function getStudentActiveCohort(studentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("student_cohort_assignments")
    .select(`
      *,
      cohort:cohorts (
        *,
        schedules:cohort_schedules(*)
      )
    `)
    .eq("student_id", studentId)
    .eq("status", "active")
    .single();

  if (error || !data) return null;
  return data;
}
