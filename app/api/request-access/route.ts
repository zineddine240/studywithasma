import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramNotification } from "@/utils/telegram";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "@/utils/env";

type AccessRequestData = {
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
  selectedCourse?: string;
  course?: string;
  currentLevel?: string;
  englishLevel?: string;
  targetBand?: string;
  reason?: string;
  additionalMessage?: string;
  message?: string;
  password?: string;
};

function cleanValue(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") {
    return "Not provided";
  }

  const cleaned = value.trim();

  if (!cleaned) {
    return "Not provided";
  }

  return cleaned.slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AccessRequestData;

    const fullName = cleanValue(body.fullName, 100);
    const email = cleanValue(body.email, 150);
    const phone = cleanValue(body.phone, 50);
    const country = cleanValue(body.country, 100);
    const selectedCourse = cleanValue(body.selectedCourse || body.course, 100);
    const currentLevel = cleanValue(body.currentLevel || body.englishLevel, 50);
    const targetBand = cleanValue(body.targetBand, 50);
    const reason = cleanValue(body.reason, 700);
    const additionalMessage = cleanValue(
      body.additionalMessage || body.message,
      700
    );

    if (
      fullName === "Not provided" ||
      email === "Not provided" ||
      selectedCourse === "Not provided"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, email and course are required.",
        },
        { status: 400 }
      );
    }

    // Optional Supabase persistence if DB is configured
    const supabaseUrl = SUPABASE_URL;
    let supabaseKey: string | null = null;
    try { supabaseKey = SUPABASE_SERVICE_ROLE_KEY(); } catch { /* not configured */ }

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        let userId: string | null = null;

        if (body.password) {
          const { data: authData } = await supabase.auth.admin.createUser({
            email,
            password: body.password,
            email_confirm: true,
            user_metadata: { full_name: fullName },
          });
          if (authData?.user) {
            userId = authData.user.id;
            await new Promise((resolve) => setTimeout(resolve, 500));
            await supabase
              .from("profiles")
              .update({ phone, country, full_name: fullName })
              .eq("id", userId);
          }
        }

        let courseId = null;
        if (selectedCourse !== "Not provided") {
          const { data: courseData } = await supabase
            .from("courses")
            .select("id")
            .eq("slug", selectedCourse)
            .single();
          if (courseData) courseId = courseData.id;
        }

        await supabase.from("enrollment_requests").insert({
          student_id: userId,
          course_id: courseId,
          current_english_level: currentLevel,
          target_band: targetBand,
          reason,
          additional_message: additionalMessage,
          status: "pending",
        });
      } catch (dbErr) {
        console.error("Supabase storage optional error:", dbErr);
      }
    }

    const telegramMessage = [
      "🔔 <b>NEW ACCESS REQUEST</b>",
      "<i>Study with Asma — IELTS Platform</i>",
      "",
      `👤 <b>Name:</b> ${fullName}`,
      `📧 <b>Email:</b> ${email}`,
      `📱 <b>Phone/WhatsApp:</b> ${phone}`,
      `🌍 <b>Country:</b> ${country}`,
      `📚 <b>Course:</b> ${selectedCourse}`,
      `📊 <b>Current level:</b> ${currentLevel}`,
      `🎯 <b>Target band:</b> ${targetBand}`,
      "",
      "📝 <b>Reason for joining:</b>",
      reason,
      "",
      "💬 <b>Additional message:</b>",
      additionalMessage,
      "",
      `🕒 ${new Date().toISOString()}`,
    ].join("\n");

    // Fire-and-forget — a Telegram failure must not block the student response
    sendTelegramNotification(telegramMessage).catch((err) =>
      console.error("[Telegram] request-access notification failed:", err)
    );

    return NextResponse.json(
      {
        success: true,
        message: "Your access request has been submitted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Request access error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
