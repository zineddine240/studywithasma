import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Return default courses when Supabase is not configured
      return NextResponse.json([
        { slug: "academic-ielts", title: "Academic IELTS" },
        { slug: "general-ielts", title: "General Training IELTS" },
      ]);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
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
