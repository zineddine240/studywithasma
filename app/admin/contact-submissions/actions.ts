"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type SubmissionStatus = "unread" | "read" | "replied";

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/contact-submissions");
}
