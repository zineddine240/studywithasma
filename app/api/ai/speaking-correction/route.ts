import { NextResponse } from "next/server";
import { aiClient, geminiModel, checkApiKey } from "@/lib/ai/gemini-server";
import { SpeakingPracticeRequestSchema, SpeakingCorrectionSchema } from "@/lib/ai/schemas";
import { isAudioFormatSupported, fileToBase64 } from "@/lib/audio";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds max timeout for Vercel

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Basic rate limiting (in-memory for mock purposes)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
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
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    // 2. Validate API Key
    try {
      checkApiKey();
    } catch (error) {
      console.error("AI Configuration Error:", error);
      return NextResponse.json(
        { error: "AI service is currently unavailable. Please check your API key configuration." },
        { status: 503 }
      );
    }

    // 3. Parse FormData
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (err) {
      return NextResponse.json({ error: "Failed to parse form data." }, { status: 400 });
    }

    const practiceType = formData.get("practiceType") as string;
    const question = formData.get("question") as string;
    const audioFile = formData.get("audio") as File;

    // Validate textual fields
    const validationResult = SpeakingPracticeRequestSchema.safeParse({ practiceType, question });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Validate Audio File
    if (!audioFile || typeof audioFile === "string") {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
    }
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Audio file is too large (maximum 10MB allowed)." }, { status: 400 });
    }
    if (!isAudioFormatSupported(audioFile.type)) {
      return NextResponse.json(
        { error: `Unsupported audio format: ${audioFile.type}. Please use a modern browser.` },
        { status: 400 }
      );
    }

    // 4. Convert Audio to Base64
    const base64Audio = await fileToBase64(audioFile);
    // Strip codec params for Gemini if needed, e.g. "audio/webm;codecs=opus" -> "audio/webm"
    const cleanMimeType = audioFile.type.split(";")[0].trim().toLowerCase();

    // 5. Construct Prompt
    const systemInstruction = `
    Purpose: Analyze an English learner’s spoken answer for language-learning purposes.

    Practice Type: ${practiceType}
    Question: ${question}

    CRITICAL INSTRUCTIONS:
    - Return ONLY valid JSON matching the exact required schema.
    - DO NOT provide IELTS Band scores, Estimated scores, numerical pronunciation/fluency scores, or official assessments.
    - Transcribe the student's spoken answer exactly as spoken.
    - Produce a corrected transcript.
    - Correct grammar, article, preposition, and word form mistakes.
    - Suggest clearer vocabulary where appropriate.
    - Comment cautiously on speaking pace and pauses without giving a numerical score.
    - Comment on whether the answer addresses the question.
    - Preserve the student’s intended meaning and original ideas.
    - Provide an improved version of the same answer.
    - Suggest useful follow-up questions.
    - Use simple explanations suitable for an English learner.

    Required JSON Schema:
    {
      "transcript": "Exact transcription of what was said.",
      "correctedTranscript": "The grammatically correct version.",
      "corrections": [
        {
          "originalText": "Mistake",
          "correctedText": "Correction",
          "category": "Grammar | Vocabulary | Word Form | Article | Preposition | Sentence Structure | Clarity",
          "explanation": "Simple explanation"
        }
      ],
      "vocabularySuggestions": [
        {
          "originalText": "Word used",
          "suggestedText": "Better alternative",
          "explanation": "Why it's better"
        }
      ],
      "fluencyNotes": ["Cautious comments on pace, hesitation, and repetition."],
      "clarityNotes": ["Comments on pronunciation clarity or structuring."],
      "relevanceNotes": ["Does this answer the question well?"],
      "improvedAnswer": "A full, natural, high-level example answer maintaining the student's original idea.",
      "followUpQuestions": ["Question 1", "Question 2"]
    }
    `;

    // 6. Call Gemini API
    const response = await aiClient.models.generateContent({
      model: geminiModel,
      contents: [
        {
          inlineData: {
            data: base64Audio,
            mimeType: cleanMimeType,
          },
        },
        "Please analyze this speaking practice recording."
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("Empty response from AI model.");
    }

    // 7. Parse Output Safely
    let jsonOutput;
    try {
      jsonOutput = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse AI JSON response:", responseText);
      return NextResponse.json(
        { error: "The AI model returned malformed output. Please try recording again." },
        { status: 502 }
      );
    }

    return NextResponse.json(jsonOutput, { status: 200 });

  } catch (error: any) {
    console.error("Speaking API Error:", error.message || error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your audio. Please try again." },
      { status: 500 }
    );
  }
}
