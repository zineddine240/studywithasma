"use server";

import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import { GEMINI_API_KEY } from "@/utils/env";

export async function enqueueTestGeneration(formData: FormData) {
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

  try {
    // 2. Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("test_documents")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { error: "Failed to upload document to storage." };
    }

    // 3. Insert into test_queue
    const { error: queueError } = await supabase.from("test_queue").insert({
      created_by: user.id,
      original_filename: file.name,
      file_path: filePath,
      type: type,
      status: "pending",
    });

    if (queueError) {
      console.error("Queue insert error:", queueError);
      return { error: "Failed to add document to processing queue." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Enqueue error:", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}

export async function getPendingJobs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { jobs: [] };

  const { data: jobs, count, error } = await supabase
    .from("test_queue")
    .select("*", { count: "exact" })
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(5);

  if (error) {
    console.error("Error fetching pending jobs:", error);
    return { jobs: [], count: 0 };
  }

  return { jobs: jobs || [], count: count || 0 };
}

export async function processJob(jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    // 1. Mark as processing
    const { data: job, error: fetchError } = await supabase
      .from("test_queue")
      .update({ status: "processing" })
      .eq("id", jobId)
      .eq("status", "pending") // Prevent race conditions
      .select()
      .single();

    if (fetchError || !job) {
      return { error: "Job already processing or not found" };
    }

    // 2. Download file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("test_documents")
      .download(job.file_path);

    if (downloadError || !fileData) {
      throw new Error("Failed to download file from storage");
    }

    // 3. Process with Gemini
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY() });
    const bytes = await fileData.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");

    let mimeType = fileData.type;
    if (!mimeType || mimeType === "application/octet-stream") {
      const ext = job.file_path.split('.').pop()?.toLowerCase();
      if (ext === "pdf") mimeType = "application/pdf";
      else if (ext === "png") mimeType = "image/png";
      else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
      else if (ext === "webp") mimeType = "image/webp";
      else if (ext === "txt") mimeType = "text/plain";
    }

    let contents: any[] = [];
    if (job.original_filename.endsWith(".docx")) {
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

      Target Test Type: "${job.type}"

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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Failed to generate content.");
    }

    const testData = JSON.parse(responseText);

    // 4. Save to tests table
    const { error: insertError } = await supabase.from("tests").insert({
      title: testData.title || job.original_filename.replace(/\.[^/.]+$/, ""),
      content_type: job.type,
      content_data: testData,
      created_by: user.id,
    });

    if (insertError) {
      throw new Error(`Failed to save test to database: ${insertError.message}`);
    }

    // 5. Mark job as completed
    await supabase
      .from("test_queue")
      .update({ status: "completed" })
      .eq("id", jobId);

    revalidatePath("/admin/tests");
    return { success: true, fileName: job.original_filename };

  } catch (err: any) {
    console.error(`Error processing job ${jobId}:`, err);

    // If it's a rate limit error (429), keep it pending so it retries
    const isRateLimit = err.message?.includes("429") || err.message?.includes("quota") || err.message?.includes("RESOURCE_EXHAUSTED");

    await supabase
      .from("test_queue")
      .update({
        status: isRateLimit ? "pending" : "failed",
        error: err.message
      })
      .eq("id", jobId);

    return {
      error: err.message,
      isRateLimit
    };
  }
}

export async function clearPendingQueue() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "teacher") {
    return { error: "Forbidden. You must be an admin or teacher." };
  }

  // Delete all pending jobs to cancel the queue
  const { error } = await supabase
    .from("test_queue")
    .delete()
    .eq("status", "pending");

  if (error) {
    console.error("Error clearing queue:", error);
    return { error: error.message };
  }

  return { success: true };
}
