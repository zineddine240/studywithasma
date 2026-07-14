import { StatusType } from "@/components/portal/shared/StatusBadge";

export interface RecordedLesson {
  id: string;
  title: string;
  module: string;
  duration: string;
  status: StatusType;
  progress?: number;
  publishedDate: string;
  description: string;
  objectives: string[];
  resources: { name: string; url: string }[];
  homework?: {
    title: string;
    instructions: string;
    dueDate: string;
  };
}

export const recordedLessonsData: RecordedLesson[] = [
  {
    id: "lesson-1",
    title: "IELTS Test Overview",
    module: "Introduction",
    duration: "35 minutes",
    status: "Completed",
    progress: 100,
    publishedDate: "10 July 2026",
    description: "An essential overview of the IELTS test format, including the differences between Academic and General Training, scoring criteria, and how to plan your study schedule.",
    objectives: [
      "Understand the four sections of the IELTS test.",
      "Learn how the band scoring system works.",
      "Develop a personalized study plan."
    ],
    resources: [
      { name: "Lesson Notes.pdf", url: "#" },
      { name: "IELTS Band Score Guide.pdf", url: "#" }
    ],
  },
  {
    id: "lesson-2",
    title: "Listening Section 3 Strategies",
    module: "Listening",
    duration: "48 minutes",
    status: "Completed",
    progress: 100,
    publishedDate: "12 July 2026",
    description: "Master the challenges of Listening Section 3. We cover how to follow conversations between multiple speakers and identify agreement/disagreement.",
    objectives: [
      "Identify the main speakers and their opinions.",
      "Follow the flow of a multi-speaker conversation.",
      "Avoid common distractors in multiple-choice questions."
    ],
    resources: [
      { name: "Lesson Notes.pdf", url: "#" },
      { name: "Vocabulary List.pdf", url: "#" },
      { name: "Practice Worksheet.pdf", url: "#" }
    ],
    homework: {
      title: "Listening Section 3 Practice Test",
      instructions: "Complete the Section 3 practice test in your workbook and submit your answers.",
      dueDate: "15 July 2026, 11:59 PM"
    }
  },
  {
    id: "lesson-3",
    title: "True, False, Not Given",
    module: "Reading",
    duration: "42 minutes",
    status: "In Progress",
    progress: 58,
    publishedDate: "14 July 2026",
    description: "One of the most challenging question types in the Reading test. Learn the exact difference between 'False' and 'Not Given' with practical examples.",
    objectives: [
      "Distinguish between False and Not Given.",
      "Scan for keywords effectively.",
      "Analyze the writer's claims accurately."
    ],
    resources: [
      { name: "Lesson Notes.pdf", url: "#" },
      { name: "Practice Worksheet.pdf", url: "#" }
    ],
    homework: {
      title: "Reading: TFNG Exercise",
      instructions: "Read the provided passage on 'The History of Tea' and answer the 10 TFNG questions.",
      dueDate: "18 July 2026, 11:59 PM"
    }
  },
  {
    id: "lesson-4",
    title: "Writing Task 2 — Opinion Essay",
    module: "Writing",
    duration: "55 minutes",
    status: "Not Started",
    progress: 0,
    publishedDate: "16 July 2026",
    description: "Step-by-step guide to structuring a high-scoring Opinion Essay for Writing Task 2. We cover introductions, body paragraphs, and conclusions.",
    objectives: [
      "Analyze the essay prompt correctly.",
      "Write a clear thesis statement.",
      "Structure body paragraphs using the PEEL method."
    ],
    resources: [
      { name: "Lesson Notes.pdf", url: "#" },
      { name: "Essay Templates.pdf", url: "#" },
      { name: "Vocabulary List.pdf", url: "#" }
    ],
    homework: {
      title: "Opinion Essay Draft",
      instructions: "Write a 250-word opinion essay on the topic discussed in class.",
      dueDate: "20 July 2026, 11:59 PM"
    }
  },
  {
    id: "lesson-5",
    title: "Speaking Part 2 Practice",
    module: "Speaking",
    duration: "39 minutes",
    status: "Not Started",
    progress: 0,
    publishedDate: "18 July 2026",
    description: "Interactive practice for the 2-minute long turn in Speaking Part 2. Learn how to use your 1-minute prep time efficiently.",
    objectives: [
      "Structure your 2-minute talk.",
      "Take effective notes during prep time.",
      "Use filler phrases naturally to maintain fluency."
    ],
    resources: [
      { name: "Lesson Notes.pdf", url: "#" },
      { name: "Cue Card Topics.pdf", url: "#" }
    ],
  }
];

export const continueWatchingLesson = recordedLessonsData.find(l => l.id === "lesson-3");
