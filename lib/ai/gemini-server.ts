import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_API_KEY } from "@/utils/env";

// Ensure this file is never imported into Client Components
if (typeof window !== "undefined") {
  throw new Error("gemini-server.ts can only be imported on the server.");
}

export const geminiModel = "gemini-3.5-flash";

let _aiClient: GoogleGenAI | null = null;

// Initialize the Google GenAI client securely on demand
export function getAiClient() {
  if (!_aiClient) {
    _aiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY() // Throws a clear error if the key is missing
    });
  }
  return _aiClient;
}
