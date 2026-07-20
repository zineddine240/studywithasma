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

  // 5. Update request status & expiry date
  const { error: requestError } = await adminClient
    .from("enrollment_requests")
    .update({
      status: "approved",
      expires_at: expiryDate,
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

  revalidatePath("/admin/enrollments");
  return { success: true };
}

export async function updateEnrollmentAction(
  requestId: string,
  studentId: string,
  courseId: string,
  targetBand: string,
  groupName: string,
  durationMonths: number | "permanent" | "keep",
  paymentNotes: string
) {
  const supabase = await createClient();

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

  const profileUpdate: Record<string, any> = {
    enrolled_course_id: courseId,
    target_band: targetBand,
    group_name: groupName,
  };

  if (durationMonths !== "keep") {
    if (durationMonths === "permanent") {
      profileUpdate.enrollment_expiry = null;
    } else {
      const d = new Date();
      d.setMonth(d.getMonth() + durationMonths);
      profileUpdate.enrollment_expiry = d.toISOString();
    }
  }

  const { error: profileError } = await adminClient
    .from("profiles")
    .update(profileUpdate)
    .eq("id", studentId);

  if (profileError) {
    console.error("Profile update error:", profileError);
    return { error: "Failed to update profile." };
  }

  const requestUpdate: Record<string, any> = {
    course_id: courseId,
    target_band: targetBand,
  };

  if (durationMonths !== "keep") {
    requestUpdate.expires_at = profileUpdate.enrollment_expiry;
  }

  if (paymentNotes) {
    requestUpdate.additional_message = `[ADMIN PAYMENT NOTE]: ${paymentNotes}`;
  }

  const { error: reqError } = await adminClient
    .from("enrollment_requests")
    .update(requestUpdate)
    .eq("id", requestId);

  if (reqError) {
    console.error("Request update error:", reqError);
  }

  revalidatePath("/admin/enrollments");
  return { success: true };
}

export async function revokeEnrollmentAction(requestId: string, studentId: string) {
  const supabase = await createClient();

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

  const { error: profileError } = await adminClient
    .from("profiles")
    .update({
      is_enrolled: false,
      enrolled_course_id: null,
      enrollment_expiry: null,
    })
    .eq("id", studentId);

  if (profileError) {
    console.error("Revoke profile error:", profileError);
    return { error: "Failed to revoke student access." };
  }

  const { error: reqError } = await adminClient
    .from("enrollment_requests")
    .update({ status: "rejected", expires_at: null })
    .eq("id", requestId);

  if (reqError) {
    console.error("Revoke request error:", reqError);
  }

  revalidatePath("/admin/enrollments");
  return { success: true };
}

export async function createDirectEnrollmentAction(
  studentId: string,
  courseId: string,
  targetBand: string,
  groupName: string,
  durationMonths: number | "permanent",
  paymentNotes: string
) {
  const supabase = await createClient();

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

  let expiryDate = null;
  if (durationMonths !== "permanent") {
    const d = new Date();
    d.setMonth(d.getMonth() + durationMonths);
    expiryDate = d.toISOString();
  }

  const { error: profileError } = await adminClient
    .from("profiles")
    .update({
      is_enrolled: true,
      enrolled_course_id: courseId,
      target_band: targetBand || "6.5",
      group_name: groupName || "Self-Paced",
      enrollment_expiry: expiryDate,
    })
    .eq("id", studentId);

  if (profileError) {
    console.error("Direct enrollment profile error:", profileError);
    return { error: "Failed to enroll student." };
  }

  const { error: reqError } = await adminClient
    .from("enrollment_requests")
    .insert({
      student_id: studentId,
      course_id: courseId,
      target_band: targetBand || "6.5",
      status: "approved",
      expires_at: expiryDate,
      additional_message: paymentNotes ? `[DIRECT ENROLLMENT NOTE]: ${paymentNotes}` : "Direct admin enrollment",
    });

  if (reqError) {
    console.error("Direct enrollment request insert error:", reqError);
  }

  revalidatePath("/admin/enrollments");
  return { success: true };
}
