"use client";

export type WritingTestStatus = "Not Started" | "Draft" | "Submitted" | "Completed";

const DRAFT_PREFIX = "writing-draft-";
const STATUS_PREFIX = "writing-status-";

export interface WritingDraft {
  texts: string[];
  timeLeft?: number;
  hasStarted?: boolean;
}

export const getWritingDraft = (testId: string, userId: string): WritingDraft | null => {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(`${DRAFT_PREFIX}${userId}-${testId}`);
  if (!val) return null;
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return { texts: parsed }; // Old array format
    if (typeof parsed === 'string') return { texts: [parsed] }; // Very old single string
    return parsed; // New object format
  } catch (e) {
    return { texts: [val] }; // Fallback
  }
};

export const saveWritingDraft = (testId: string, userId: string, draft: WritingDraft): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${DRAFT_PREFIX}${userId}-${testId}`, JSON.stringify(draft));

  if (draft.texts && draft.texts.some(text => text.trim().length > 0)) {
    const currentStatus = getWritingStatus(testId, userId);
    if (currentStatus === "Not Started") {
      saveWritingStatus(testId, userId, "Draft");
    }
  }
};

export const clearWritingDraft = (testId: string, userId: string): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${DRAFT_PREFIX}${userId}-${testId}`);
};

export const getWritingStatus = (testId: string, userId: string): WritingTestStatus => {
  if (typeof window === "undefined") return "Not Started";
  const status = localStorage.getItem(`${STATUS_PREFIX}${userId}-${testId}`);
  return (status as WritingTestStatus) || "Not Started";
};

export const saveWritingStatus = (testId: string, userId: string, status: WritingTestStatus): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STATUS_PREFIX}${userId}-${testId}`, status);
};
