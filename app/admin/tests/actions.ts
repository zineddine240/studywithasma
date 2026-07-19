'use server'

import { createClient } from '@/utils/supabase/server'
import { GoogleGenAI } from '@google/genai'
import { revalidatePath } from 'next/cache'

export async function generateTestAction(formData: FormData) {
  const type = formData.get('type') as string
  const topic = formData.get('topic') as string
  const difficulty = formData.get('difficulty') as string

  if (!type || !topic || !difficulty) {
    return { error: 'All fields are required.' }
  }

  // 1. Verify User is Admin/Teacher
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'teacher') {
    return { error: 'Forbidden. You must be an admin or teacher to generate tests.' }
  }

  // 2. Initialize Gemini Client
  // Using the new @google/genai SDK
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

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
  `

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    })

    const responseText = response.text
    if (!responseText) {
      throw new Error("Failed to generate content.")
    }

    // Attempt to parse JSON to ensure it's valid before saving
    const testData = JSON.parse(responseText)

    // 3. Save to Supabase
    const { error: insertError } = await supabase.from('tests').insert({
      title: testData.title || `${type.charAt(0).toUpperCase() + type.slice(1)}: ${topic}`,
      content_type: type,
      content_data: testData,
      created_by: user.id
    })

    if (insertError) {
      console.error("Supabase Error:", insertError)
      return { error: 'Failed to save the test to the database.' }
    }

    revalidatePath('/admin/tests')
    return { success: true }
    
  } catch (err: any) {
    console.error("AI Generation Error:", err)
    return { error: err.message || 'An error occurred during AI generation.' }
  }
}

export async function createManualTestAction(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'teacher') {
    return { error: 'Forbidden. You must be an admin or teacher to create tests.' }
  }

  try {
    const { error: insertError } = await supabase.from('tests').insert({
      title: data.title,
      content_type: data.type,
      content_data: data.content_data,
      created_by: user.id
    })

    if (insertError) {
      console.error("Supabase Error:", insertError)
      return { error: 'Failed to save the test to the database.' }
    }

    revalidatePath('/admin/tests')
    return { success: true }
  } catch (err: any) {
    console.error("Manual Creation Error:", err)
    return { error: err.message || 'An error occurred during manual creation.' }
  }
}
