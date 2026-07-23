"use server";

import { after } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendTelegramNotification } from "@/utils/telegram";


export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_submissions")
    .insert([{ ...data, status: "unread" }]);

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  // Notify instructor channel — fire-and-forget
  const telegramMessage = [
    "📩 <b>NEW CONTACT MESSAGE</b>",
    "<i>Study with Asma — IELTS Platform</i>",
    "",
    `👤 <b>Name:</b> ${data.name}`,
    `📧 <b>Email:</b> ${data.email}`,
    `💬 <b>Subject:</b> ${data.subject}`,
    "",
    `📝 <b>Message:</b>`,
    data.message,
    "",
    `🕒 ${new Date().toISOString()}`,
  ].join("\n");

  // Schedule after response — guaranteed to run on Vercel serverless
  after(() =>
    sendTelegramNotification(telegramMessage).catch((err) =>
      console.error("[Telegram] contact-form notification failed:", err)
    )
  );

  return { success: true };
}
