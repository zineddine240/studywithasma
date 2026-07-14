/**
 * Helper to determine the best supported audio MIME type for MediaRecorder.
 * Gemini supports webm, mp4, mp3, wav, ogg. 
 */
export function getBestSupportedAudioType(): string {
  if (typeof window === "undefined") return "audio/webm";

  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  throw new Error("No supported audio format found for recording in this browser.");
}

/**
 * Validates if the uploaded MIME type is supported by Gemini.
 */
export const ALLOWED_AUDIO_MIME_TYPES = [
  "audio/webm",
  "audio/mp4",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
  "audio/flac"
];

export function isAudioFormatSupported(mimeType: string): boolean {
  // Strip out codec parameters (e.g., "audio/webm;codecs=opus" -> "audio/webm")
  const baseType = mimeType.split(";")[0].trim().toLowerCase();
  return ALLOWED_AUDIO_MIME_TYPES.includes(baseType);
}

/**
 * Converts a browser File/Blob to a Base64 string for inline API transmission.
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}
