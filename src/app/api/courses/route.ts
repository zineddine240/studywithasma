import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/env";

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      // Return default courses when Supabase is not configured
      return NextResponse.json([
        { slug: "academic-ielts", title: "Academic IELTS" },
        { slug: "general-ielts", title: "General Training IELTS" },
      ]);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase

      .from("courses")
      .select("slug, title")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return NextResponse.json([
        { slug: "academic-ielts", title: "Academic IELTS" },
        { slug: "general-ielts", title: "General Training IELTS" },
      ]);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json([
      { slug: "academic-ielts", title: "Academic IELTS" },
      { slug: "general-ielts", title: "General Training IELTS" },
    ]);
  }
}
