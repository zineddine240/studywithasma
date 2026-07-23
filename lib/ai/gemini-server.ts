import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_API_KEY } from "@/utils/env";

// Ensure this file is never imported into Client Components
if (typeof window !== "undefined") {
  throw new Error("gemini-server.ts can only be imported on the server.");
}

export const geminiModel = "gemini-3.5-flash";

// Initialize the Google GenAI client securely
export const aiClient = new GoogleGenAI({
  apiKey: GEMINI_API_KEY() // Throws a clear error if the key is missing
});

/**
 * No-op kept for backward compatibility.
 * GEMINI_API_KEY() already throws at module load if the key is missing,
 * so by the time any route runs, the key is guaranteed to be present.
 */
export function checkApiKey() {
  // validation is handled by GEMINI_API_KEY() in utils/env.ts
}
