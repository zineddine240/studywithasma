import { z } from "zod";

// ============================================================================
// WRITING PRACTICE SCHEMAS
// ============================================================================

export const WritingPracticeRequestSchema = z.object({
  practiceType: z.enum([
    "Academic Writing Task 1",
    "General Writing Task 1",
    "Writing Task 2",
    "General English Writing",
  ]),
  topic: z.string().optional(),
  studentAnswer: z
    .string()
    .min(20, "Answer is too short.")
    .max(5000, "Answer is too long (max 5000 characters)."),
  consent: z.literal(true, {
    message: "You must consent to submit your writing.",
  }),
});

// The strict schema we expect Gemini to return for Writing
export const WritingCorrectionSchema = z.object({
  correctedText: z.string(),
  corrections: z.array(
    z.object({
      originalText: z.string(),
      correctedText: z.string(),
      category: z.enum([
        "Grammar",
        "Spelling",
        "Punctuation",
        "Vocabulary",
        "Word Form",
        "Article",
        "Preposition",
        "Sentence Structure",
        "Clarity",
      ]),
      explanation: z.string(),
    })
  ),
  vocabularySuggestions: z.array(
    z.object({
      originalText: z.string(),
      suggestedText: z.string(),
      explanation: z.string(),
    })
  ).optional().default([]),
  claritySuggestions: z.array(z.string()).optional().default([]),
  generalNotes: z.array(z.string()),
});

export type WritingPracticeRequest = z.infer<typeof WritingPracticeRequestSchema>;
export type WritingCorrectionResponse = z.infer<typeof WritingCorrectionSchema>;


// ============================================================================
// SPEAKING PRACTICE SCHEMAS
// ============================================================================

export const SpeakingPracticeRequestSchema = z.object({
  practiceType: z.enum([
    "Speaking Part 1",
    "Speaking Part 2",
    "Speaking Part 3",
    "General Conversation",
  ]),
  question: z.string().min(1, "Question is required."),
  // The audio file itself will be handled via FormData, so we don't strictly zod-validate the file buffer here.
});

// The strict schema we expect Gemini to return for Speaking
export const SpeakingCorrectionSchema = z.object({
  transcript: z.string(),
  correctedTranscript: z.string(),
  corrections: z.array(
    z.object({
      originalText: z.string(),
      correctedText: z.string(),
      category: z.enum([
        "Grammar",
        "Vocabulary",
        "Word Form",
        "Article",
        "Preposition",
        "Sentence Structure",
        "Clarity",
      ]),
      explanation: z.string(),
    })
  ).optional().default([]),
  vocabularySuggestions: z.array(
    z.object({
      originalText: z.string(),
      suggestedText: z.string(),
      explanation: z.string(),
    })
  ).optional().default([]),
  fluencyNotes: z.array(z.string()).optional().default([]),
  clarityNotes: z.array(z.string()).optional().default([]),
  relevanceNotes: z.array(z.string()).optional().default([]),
  improvedAnswer: z.string(),
  followUpQuestions: z.array(z.string()).optional().default([]),
});

export type SpeakingPracticeRequest = z.infer<typeof SpeakingPracticeRequestSchema>;
export type SpeakingCorrectionResponse = z.infer<typeof SpeakingCorrectionSchema>;
