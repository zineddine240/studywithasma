import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: modules, error } = await supabase.from("modules").select("*");
  const { data: courses } = await supabase.from("courses").select("*");
  
  return NextResponse.json({
    modules,
    courses,
    error
  });
}
