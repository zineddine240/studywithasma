"use server";

import { createClient } from "@/utils/supabase/server";

export async function searchStudentsAction(query: string) {
  if (!query || query.length < 2) return [];

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return [];
  }

  // Search by full_name or email
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, is_enrolled, enrolled_course_id, target_band, group_name")
    .eq("role", "student")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(10);

  return data || [];
}
