export type QuestionType =
  | 'multiple_choice'
  | 'tf_ng'
  | 'yn_ng'
  | 'summary_completion'
  | 'note_completion'
  | 'flow_chart_completion'
  | 'drag_and_drop'
  | 'matching';

export interface QuestionItem {
  id?: string;
  number?: number;
  question?: string;
  options?: string[];
  correct_answer: string;
  alternative_answers?: string[];
  explanation?: string;
}

export interface QuestionGroupItem {
  id?: string;
  type: QuestionType;
  title: string;
  instruction: string;
  content?: string; // Passage/summary text with [Q1], [Q2] tokens
  options?: string[]; // Word bank options or matching options
  questions: QuestionItem[];
}

export interface TestPartItem {
  id?: string;
  title: string;
  passage: string;
  questionGroups: QuestionGroupItem[];
}

export interface StructuredTestData {
  duration_minutes?: number;
  parts?: TestPartItem[];
  // Backward compatibility for simple 1-passage tests
  passage?: string;
  questions?: QuestionItem[];
}
