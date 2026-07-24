"use client";

import { WritingTestStatus } from "../mock/writing-tests";

const DRAFT_PREFIX = "writing-draft-";
const STATUS_PREFIX = "writing-status-";

export const getWritingDraft = (testId: string): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(`${DRAFT_PREFIX}${testId}`) || "";
};

export const saveWritingDraft = (testId: string, text: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${DRAFT_PREFIX}${testId}`, text);
  
  // If we save a draft and it's not empty, make sure status is Draft
  // (Unless it was already Submitted or Completed, but usually if they are typing, it's a draft)
  if (text.trim().length > 0) {
    const currentStatus = getWritingStatus(testId);
    if (currentStatus === "Not Started") {
      saveWritingStatus(testId, "Draft");
    }
  }
};

export const clearWritingDraft = (testId: string): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${DRAFT_PREFIX}${testId}`);
};

export const getWritingStatus = (testId: string): WritingTestStatus => {
  if (typeof window === "undefined") return "Not Started";
  const status = localStorage.getItem(`${STATUS_PREFIX}${testId}`);
  return (status as WritingTestStatus) || "Not Started";
};

export const saveWritingStatus = (testId: string, status: WritingTestStatus): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STATUS_PREFIX}${testId}`, status);
};
