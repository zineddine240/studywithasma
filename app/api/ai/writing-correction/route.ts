import { NextResponse } from "next/server";
import { aiClient, geminiModel, checkApiKey } from "@/lib/ai/gemini-server";
import { WritingPracticeRequestSchema } from "@/lib/ai/schemas";

// Basic rate limiting structure (in-memory for mock purposes)
// In production, use Redis or a proper rate limiting service.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowData = rateLimitMap.get(ip);
  if (!windowData || now - windowData.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (windowData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  windowData.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    // 1. Basic Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    // 2. Validate API Key configuration
    try {
      checkApiKey();
    } catch (error) {
      console.error("AI Configuration Error:", error);
      return NextResponse.json(
        { error: "AI service is currently unavailable. Please try again later." },
        { status: 503 }
      );
    }

    // 3. Parse and Validate Request Body
    const body = await req.json();
    const validationResult = WritingPracticeRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { practiceType, topic, studentAnswer } = validationResult.data;

    // 4. Construct AI Prompt
    const systemInstruction = `
    You are an expert English teacher. Review the following student writing.
    Practice Type: ${practiceType}
    ${topic ? `Topic/Question: ${topic}` : ''}
    
    CRITICAL INSTRUCTIONS:
    - Return ONLY valid JSON matching the exact required schema.
    - DO NOT provide IELTS Band scores, Estimated scores, or official assessments.
    - Correct grammar, spelling, punctuation, vocabulary, word forms, articles, prepositions, and sentence structure.
    - Preserve the student's intended meaning, original ideas, and approximate language level.
    - Do NOT rewrite the answer in an artificially advanced style.
    - Explain corrections clearly in simple English.
    
    Required JSON Schema:
    {
      "correctedText": "The full text with all corrections applied.",
      "corrections": [
        {
          "originalText": "The specific error.",
          "correctedText": "The corrected version.",
          "category": "Grammar | Spelling | Punctuation | Vocabulary | Word Form | Article | Preposition | Sentence Structure | Clarity",
          "explanation": "Simple explanation of why this was corrected."
        }
      ],
      "vocabularySuggestions": [
        {
          "originalText": "A word used by the student.",
          "suggestedText": "A slightly better alternative.",
          "explanation": "Why this word is better in this context."
        }
      ],
      "claritySuggestions": ["Suggestions to make paragraphs or arguments clearer."],
      "generalNotes": ["Overall positive feedback and specific areas to practice."]
    }
    `;

    // 5. Call Gemini API
    const response = await aiClient.models.generateContent({
      model: geminiModel,
      contents: studentAnswer,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("Empty response from AI model.");
    }

    // 6. Safely Parse the AI JSON Output
    let jsonOutput;
    try {
      jsonOutput = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse AI JSON response:", responseText);
      throw new Error("Invalid output format returned by AI.");
    }

    // Return the successfully parsed JSON directly to the client.
    // The client will zod-validate the shape as an extra precaution before rendering.
    return NextResponse.json(jsonOutput, { status: 200 });

  } catch (error) {
    console.error("Writing API Error:", error);
    // Do not expose raw internal errors to the client
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your writing. Please try again." },
      { status: 500 }
    );
  }
}
