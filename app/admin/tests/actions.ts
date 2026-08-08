"use server";

import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import { GEMINI_API_KEY } from "@/utils/env";

export async function generateTestAction(formData: FormData) {
  const type = formData.get("type") as string;
  const topic = formData.get("topic") as string;
  const difficulty = formData.get("difficulty") as string;

  if (!type || !topic || !difficulty) {
    return { error: "All fields are required." };
  }

  // 1. Verify User is Admin/Teacher
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return {
      error: "Forbidden. You must be an admin or teacher to generate tests.",
    };
  }

  // 2. Initialize Gemini Client
  // Using the new @google/genai SDK
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY() });

  const prompt = `
    You are an expert IELTS examiner. 
    Generate an IELTS ${type} practice test about the topic: "${topic}".
    The difficulty should be: ${difficulty}.
    
    Return the test strictly as a valid JSON object matching this schema exactly:
    {
      "title": "A descriptive title for the test",
      "passage": "The reading passage or writing prompt text. Use \\n for paragraphs.",
      "questions": [
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"], // Only for reading/level_test
          "correct_answer": "The exact string of the correct option", // Only for reading/level_test
          "explanation": "Why this answer is correct" // Only for reading/level_test
        }
      ]
    }
    
    Output ONLY valid JSON. Do not include markdown code blocks (\`\`\`json) or any other text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Failed to generate content.");
    }

    // Attempt to parse JSON to ensure it's valid before saving
    const testData = JSON.parse(responseText);

    // 3. Save to Supabase
    const { error: insertError } = await supabase.from("tests").insert({
      title:
        testData.title ||
        `${type.charAt(0).toUpperCase() + type.slice(1)}: ${topic}`,
      content_type: type,
      content_data: testData,
      created_by: user.id,
    });

    if (insertError) {
      console.error("Supabase Error:", insertError);
      return { error: "Failed to save the test to the database." };
    }

    revalidatePath("/admin/tests");
    return { success: true };
  } catch (err: any) {
    console.error("AI Generation Error:", err);
    return { error: err.message || "An error occurred during AI generation." };
  }
}

export async function createManualTestAction(data: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return {
      error: "Forbidden. You must be an admin or teacher to create tests.",
    };
  }

  try {
    const { error: insertError } = await supabase.from("tests").insert({
      title: data.title,
      content_type: data.type,
      content_data: data.content_data,
      created_by: user.id,
    });

    if (insertError) {
      console.error("Supabase Error:", insertError);
      return { error: "Failed to save the test to the database." };
    }

    revalidatePath("/admin/tests");
    return { success: true };
  } catch (err: any) {
    console.error("Manual Creation Error:", err);
    return {
      error: err.message || "An error occurred during manual creation.",
    };
  }
}

export async function updateTestAction(id: string, data: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return {
      error: "Forbidden. You must be an admin or teacher to update tests.",
    };
  }

  try {
    const { error: updateError } = await supabase
      .from("tests")
      .update({
        title: data.title,
        content_type: data.type,
        content_data: data.content_data,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Supabase Error:", updateError);
      return { error: "Failed to update the test in the database." };
    }

    revalidatePath("/admin/tests");
    revalidatePath(`/admin/tests/${id}`);
    return { success: true };
  } catch (err: any) {
    console.error("Update Test Error:", err);
    return {
      error: err.message || "An error occurred while updating the test.",
    };
  }
}

export async function deleteTestAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return {
      error: "Forbidden. You must be an admin or teacher to delete tests.",
    };
  }

  try {
    const { error: deleteError } = await supabase
      .from("tests")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase Error:", deleteError);
      return { error: "Failed to delete the test from the database." };
    }

    revalidatePath("/admin/tests");
    return { success: true };
  } catch (err: any) {
    console.error("Delete Test Error:", err);
    return {
      error: err.message || "An error occurred while deleting the test.",
    };
  }
}

export async function generateTestFromDocumentAction(formData: FormData) {
  const file = formData.get("file") as File;
  const type = (formData.get("type") as string) || "reading";

  if (!file || file.size === 0) {
    return { error: "Please upload a document or image file." };
  }

  // 1. Verify user is admin/teacher
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return {
      error: "Forbidden. You must be an admin or teacher to process documents.",
    };
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY() });

  const bytes = await file.arrayBuffer();
  const base64Data = Buffer.from(bytes).toString("base64");
  let mimeType = file.type;

  if (!mimeType) {
    if (file.name.endsWith(".pdf")) mimeType = "application/pdf";
    else if (file.name.endsWith(".png")) mimeType = "image/png";
    else if (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg")) mimeType = "image/jpeg";
    else if (file.name.endsWith(".webp")) mimeType = "image/webp";
    else if (file.name.endsWith(".txt")) mimeType = "text/plain";
  }

  let contents: any[] = [];

  if (file.name.endsWith(".docx")) {
    const buffer = Buffer.from(bytes);
    const textContent = buffer.toString("utf-8").replace(/<[^>]+>/g, " ");
    contents = [
      `Here is the raw extracted text content from the document:\n\n${textContent}`,
    ];
  } else {
    contents = [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType || "application/pdf",
        },
      },
    ];
  }

  const prompt = `
    You are an expert IELTS test analyzer and parser.
    Examine the attached document carefully and convert its content into a fully structured practice test payload matching our exact data model.

    Target Test Type: "${type}"

    Structure the JSON output strictly according to this schema:

    {
      "title": "Clear, descriptive title extracted or derived from the document",
      "duration_minutes": 60,
      "parts": [
        {
          "title": "Part 1",
          "passage": "Full passage text extracted from document. Preserve formatting and paragraphs with \\n.",
          "questionGroups": [
            {
              "type": "multiple_choice" | "tf_ng" | "yn_ng" | "summary_completion" | "note_completion" | "flow_chart_completion" | "drag_and_drop" | "matching",
              "title": "Questions 1-7",
              "instruction": "Do the following statements agree with the information given in Reading Passage 1?",
              "content": "For completion question types only: the passage snippet or summary containing blanks like [Q1], [Q2], [Q3]",
              "options": ["Option A", "Option B", "Option C"],
              "questions": [
                {
                  "number": 1,
                  "question": "Question prompt text",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correct_answer": "Exact correct answer string derived from text or answer key",
                  "explanation": "Brief explanation of why this answer is correct based on the passage"
                }
              ]
            }
          ]
        }
      ]
    }

    IMPORTANT RULES:
    1. Parse ALL passages and ALL questions found in the document into the correct "parts" and "questionGroups".
    2. Choose the correct "type" for each group:
       - 'multiple_choice' for standard A, B, C, D choices
       - 'tf_ng' for True / False / Not Given
       - 'yn_ng' for Yes / No / Not Given
       - 'summary_completion' for text with blanks to fill
       - 'note_completion' for note completion
       - 'matching' for matching headings or statements
       - 'drag_and_drop' for word bank completion
    3. Ensure question numbers are sequentially assigned (e.g. 1, 2, 3...).
    4. For fill-in-the-blank questions, ensure the "content" field contains tokens like [Q1], [Q2] matching the question numbers.
    5. Output ONLY valid JSON matching this schema. Do not output markdown codeblocks (\`\`\`json) or extra text.
  `;

  contents.push(prompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    const testPayload = JSON.parse(text);
    return { success: true, payload: testPayload };
  } catch (err: any) {
    console.error("AI Document Parsing Error:", err);
    return { error: err.message || "Failed to process document with AI." };
  }
}
