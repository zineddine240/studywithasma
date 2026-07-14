import { GoogleGenAI, Type } from "@google/genai";

// Ensure this file is never imported into Client Components
if (typeof window !== "undefined") {
  throw new Error("gemini-server.ts can only be imported on the server.");
}

const apiKey = process.env.GEMINI_API_KEY;

export const geminiModel = "gemini-3.5-flash";

// Initialize the Google GenAI client securely
export const aiClient = new GoogleGenAI({ 
  apiKey: apiKey || "MISSING_KEY" // Fallback to prevent crash during instantiation, but requests will fail securely
});

/**
 * Validates if the API key is present before attempting a call.
 * This prevents confusing raw Gemini errors from bubbling up to the client.
 */
export function checkApiKey() {
  if (!apiKey || apiKey === "MISSING_KEY") {
    throw new Error("GEMINI_API_KEY is not configured in the server environment.");
  }
}
