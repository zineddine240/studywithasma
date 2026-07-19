import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Use service role to bypass RLS for inserting requests safely
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Sign up the user
    // We do NOT confirm email for this flow automatically, or we rely on the project's default settings
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true, // Auto-confirm email so they can log in later
        user_metadata: {
          full_name: data.fullName,
        },
      });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return NextResponse.json(
          { error: "This email is already registered. Please log in instead." },
          { status: 400 },
        );
      }
      throw authError;
    }

    const userId = authData.user.id;

    // Wait a brief moment to ensure the `handle_new_user` trigger has completed creating the profile
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 2. Update profile with phone and country
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        phone: data.phone,
        country: data.country,
        full_name: data.fullName,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Profile update error:", profileError);
      // We don't fail the request here, but log it
    }

    // 3. Resolve course ID from slug if needed (The form sends slugs "academic-ielts" or "general-ielts")
    let courseId = null;
    if (data.course) {
      const { data: courseData } = await supabase
        .from("courses")
        .select("id")
        .eq("slug", data.course)
        .single();

      if (courseData) {
        courseId = courseData.id;
      }
    }

    // 4. Insert enrollment request
    const { error: requestError } = await supabase
      .from("enrollment_requests")
      .insert({
        student_id: userId,
        course_id: courseId,
        current_english_level: data.englishLevel,
        target_band: data.targetBand,
        reason: data.reason,
        additional_message: data.message,
        status: "pending",
      });

    if (requestError) {
      throw requestError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Enrollment Request Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
