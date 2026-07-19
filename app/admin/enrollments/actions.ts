"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function approveEnrollment(
  requestId: string,
  studentId: string,
  courseId: string,
  targetBand: string,
  durationMonths: number | "permanent",
  paymentNotes: string
) {
  const supabase = await createClient();

  // 1. Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return { error: "Unauthorized" };
  }

  // 2. Calculate expiry
  let expiryDate = null;
  if (durationMonths !== "permanent") {
    const d = new Date();
    d.setMonth(d.getMonth() + durationMonths);
    expiryDate = d.toISOString();
  }

  // 3. Create Admin Client to bypass RLS
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 4. Update student profile
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({
      is_enrolled: true,
      enrolled_course_id: courseId,
      target_band: targetBand,
      enrollment_expiry: expiryDate,
    })
    .eq("id", studentId);

  if (profileError) {
    console.error("Profile update error:", profileError);
    return { error: "Failed to update student profile." };
  }

  // 5. Update request status
  // We save the paymentNotes in additional_message or we could add a new column. 
  // Let's append to reason for now or just mark as approved.
  const { error: requestError } = await adminClient
    .from("enrollment_requests")
    .update({
      status: "approved",
      // Optionally save payment notes in a specific admin notes column if we added one, 
      // but for now, we'll just log it or append it.
      additional_message: paymentNotes ? `[ADMIN PAYMENT NOTE]: ${paymentNotes}` : undefined
    })
    .eq("id", requestId);

  if (requestError) {
    console.error("Request update error:", requestError);
    return { error: "Failed to update request status." };
  }

  revalidatePath("/admin/enrollments");
  return { success: true };
}

export async function rejectEnrollment(requestId: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return { error: "Unauthorized" };
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await adminClient
    .from("enrollment_requests")
    .update({ status: "rejected" })
    .eq("id", requestId);

  if (error) {
    return { error: "Failed to reject request." };
  }

  revalidatePath("/admin/enrollments");
  return { success: true };
}
