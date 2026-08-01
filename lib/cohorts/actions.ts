"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCohort(data: any, schedules: any[]) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return { error: "Forbidden" };
  }

  // Transaction-like approach: Insert cohort, then schedules
  const { data: cohort, error: cohortError } = await supabase
    .from("cohorts")
    .insert([data])
    .select()
    .single();

  if (cohortError) {
    console.error("Error creating cohort:", cohortError);
    return { error: cohortError.message };
  }

  if (schedules && schedules.length > 0) {
    const schedulesToInsert = schedules.map(s => ({
      ...s,
      cohort_id: cohort.id
    }));
    
    const { error: scheduleError } = await supabase
      .from("cohort_schedules")
      .insert(schedulesToInsert);
      
    if (scheduleError) {
      console.error("Error adding schedules:", scheduleError);
      return { error: scheduleError.message };
    }
  }

  revalidatePath("/admin/cohorts");
  return { success: true, cohort };
}

export async function updateCohort(id: string, data: any, schedules: any[]) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") return { error: "Forbidden" };

  const { error: cohortError } = await supabase
    .from("cohorts")
    .update(data)
    .eq("id", id);

  if (cohortError) return { error: cohortError.message };

  // Update schedules: simplest approach is delete existing and insert new
  await supabase.from("cohort_schedules").delete().eq("cohort_id", id);
  
  if (schedules && schedules.length > 0) {
    const schedulesToInsert = schedules.map(s => ({
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time,
      cohort_id: id
    }));
    await supabase.from("cohort_schedules").insert(schedulesToInsert);
  }

  revalidatePath(`/admin/cohorts`);
  revalidatePath(`/admin/cohorts/${id}`);
  return { success: true };
}

export async function approveStudentIntoCohort(enrollmentRequestId: string, studentId: string, cohortId: string) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: "Unauthorized" };

  // 1. Verify capacity atomically via RPC (or select count in a transaction if RPC not available)
  // Since we haven't defined an RPC, we will do a count check, and if under, insert. 
  // In a high concurrency env, an RPC is better.
  const { data: cohort, error: cohortErr } = await supabase
    .from("cohorts")
    .select("max_students, status, is_visible_for_registration")
    .eq("id", cohortId)
    .single();

  if (cohortErr || !cohort) return { error: "Cohort not found" };
  if (cohort.status !== 'open' && cohort.status !== 'active') return { error: "Cohort is not open or active" };

  const { count } = await supabase
    .from("student_cohort_assignments")
    .select("*", { count: "exact", head: true })
    .eq("cohort_id", cohortId)
    .eq("status", "active");

  const enrolled = count || 0;
  if (enrolled >= cohort.max_students) {
    // Also auto-mark cohort as full
    await supabase.from("cohorts").update({ status: 'full', is_visible_for_registration: false }).eq("id", cohortId);
    return { error: "Cohort is full" };
  }

  // 2. Insert assignment
  const { error: assignErr } = await supabase
    .from("student_cohort_assignments")
    .insert([{
      student_id: studentId,
      cohort_id: cohortId,
      enrollment_id: enrollmentRequestId,
      status: 'active'
    }]);

  if (assignErr) return { error: assignErr.message };

  // 3. Update enrollment request
  await supabase
    .from("enrollment_requests")
    .update({ 
      assigned_cohort_id: cohortId, 
      cohort_assignment_status: 'approved',
      status: 'approved'
    })
    .eq("id", enrollmentRequestId);
    
  // 4. Update profile (is_enrolled)
  await supabase
    .from("profiles")
    .update({ is_enrolled: true })
    .eq("id", studentId);

  // If this student reached the capacity, mark full
  if (enrolled + 1 >= cohort.max_students) {
    await supabase.from("cohorts").update({ status: 'full', is_visible_for_registration: false }).eq("id", cohortId);
  }

  revalidatePath("/admin/enrollments");
  revalidatePath(`/admin/cohorts/${cohortId}`);
  
  return { success: true };
}
