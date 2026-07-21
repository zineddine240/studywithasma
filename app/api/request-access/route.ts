import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Notification service is not configured.",
        },
        { status: 500 }
      );
    }

    const telegramMessage = [
      "🔔 NEW ACCESS REQUEST",
      "",
      "Study with Asma IELTS Platform",
      "",
      `👤 Full name: ${fullName}`,
      `📧 Email: ${email}`,
      `📱 Phone/WhatsApp: ${phone}`,
      `🌍 Country: ${country}`,
      `📚 Course: ${selectedCourse}`,
      `📊 Current level: ${currentLevel}`,
      `🎯 Target band: ${targetBand}`,
      "",
      "📝 Reason for joining:",
      reason,
      "",
      "💬 Additional message:",
      additionalMessage,
      "",
      `🕒 Received: ${new Date().toISOString()}`,
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
        }),
        cache: "no-store",
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram error:", telegramResult);

      return NextResponse.json(
        {
          success: false,
          message: "The request could not be sent.",
        },
        { status: 502 }
      );
    }

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
