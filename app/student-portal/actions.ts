"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function markLessonCompleted(lessonId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  // Check if progress exists
  const { data: existingProgress } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("student_id", user.id)
    .eq("lesson_id", lessonId)
    .single();

  if (existingProgress) {
    // Update existing
    const { error } = await supabase
      .from("lesson_progress")
      .update({ is_completed: true, progress_percent: 100 })
      .eq("id", existingProgress.id);

    if (error) return { error: error.message };
  } else {
    // Insert new
    const { error } = await supabase
      .from("lesson_progress")
      .insert({
        student_id: user.id,
        lesson_id: lessonId,
        is_completed: true,
        progress_percent: 100,
      });

    if (error) return { error: error.message };
  }

  revalidatePath("/student-portal/course");
  revalidatePath("/student-portal/recorded-lessons");
  revalidatePath(`/student-portal/recorded-lessons/${lessonId}`);

  return { success: true };
}

export async function updateStudentProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const full_name = (formData.get("full_name") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const country = (formData.get("country") as string) || null;
  const target_band = (formData.get("target_band") as string) || null;
  const bio = (formData.get("bio") as string) || null;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name,
      phone,
      country,
      target_band,
      bio,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/student-portal");
  revalidatePath("/student-portal/profile");

  return { success: true };
}
