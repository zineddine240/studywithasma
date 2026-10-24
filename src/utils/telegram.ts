/**
 * Shared Telegram notification utility.
 * All notifications go to the single instructor channel configured via env vars.
 */

import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "@/utils/env";

export async function sendTelegramNotification(
  message: string
): Promise<void> {
  let botToken: string;
  let chatId: string;

  try {
    botToken = TELEGRAM_BOT_TOKEN();
    chatId = TELEGRAM_CHAT_ID();
  } catch {
    console.warn("[Telegram] env vars missing — notification skipped.");
    return;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    }
  );

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    console.error("[Telegram] Send failed:", result);
    throw new Error("Telegram notification failed");
  }
}
