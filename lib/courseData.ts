export interface CourseModule {
  number: number;
  name: string;
  description: string;
  lessonCount: number;
}

export interface CourseDetail {
  slug: string;
  title: string;
  badge: string;
  shortDescription: string;
  whoIsItFor: string;
  modules: CourseModule[];
  whatStudentsReceive: string[];
  learningFormat: string[];
}

export function getCourseBySlug(slug: string): CourseDetail | undefined {
  return courseDetailsData.find((c) => c.slug === slug);
}

export const courseDetailsData: CourseDetail[] = [
  {
    slug: "academic-ielts",
    title: "Academic IELTS",
    badge: "Academic",
    shortDescription:
      "Prepare for university and academic purposes through structured lessons in Listening, Reading, Writing, and Speaking.",
    whoIsItFor:
      "For students preparing for university admission, higher education, or academic purposes.",
    modules: [
      {
        number: 1,
        name: "Introduction",
        description:
          "Understand the IELTS Academic exam format, scoring system, and effective study strategies to build a strong foundation.",
        lessonCount: 4,
      },
      {
        number: 2,
        name: "Listening",
        description:
          "Develop listening skills through academic lectures, conversations, and practice tests with timed exercises.",
        lessonCount: 6,
      },
      {
        number: 3,
        name: "Reading",
        description:
          "Master academic reading passages, learn skimming and scanning techniques, and practice answering all question types.",
        lessonCount: 6,
      },
      {
        number: 4,
        name: "Writing",
        description:
          "Learn how to write Task 1 reports and Task 2 essays with clear structure, academic vocabulary, and coherence.",
        lessonCount: 5,
      },
      {
        number: 5,
        name: "Speaking",
        description:
          "Practice all three parts of the speaking test with guided exercises, sample answers, and fluency strategies.",
        lessonCount: 4,
      },
    ],
    whatStudentsReceive: [
      "Live online classes",
      "Recorded lessons",
      "PDF materials",
      "Homework",
      "Teacher feedback",
      "Progress tracking",
    ],
    learningFormat: [
      "Zoom or Google Meet classes",
      "Recorded sessions",
      "Structured modules",
      "Personal guidance from Asma",
    ],
  },
  {
    slug: "general-ielts",
    title: "General IELTS",
    badge: "General",
    shortDescription:
      "Prepare for work, migration, and everyday English communication through practical IELTS training.",
    whoIsItFor:
      "For learners preparing for work, migration, or everyday communication purposes.",
    modules: [
      {
        number: 1,
        name: "Introduction",
        description:
          "Learn about the General IELTS exam structure, assessment criteria, and how to plan your preparation effectively.",
        lessonCount: 4,
      },
      {
        number: 2,
        name: "Listening",
        description:
          "Practice with everyday conversations, workplace scenarios, and social context audio to sharpen your listening accuracy.",
        lessonCount: 6,
      },
      {
        number: 3,
        name: "Reading",
        description:
          "Work through practical reading passages from advertisements, manuals, and workplace documents with targeted strategies.",
        lessonCount: 6,
      },
      {
        number: 4,
        name: "Writing",
        description:
          "Learn to write Task 1 letters and Task 2 essays with appropriate tone, structure, and everyday vocabulary.",
        lessonCount: 5,
      },
      {
        number: 5,
        name: "Speaking",
        description:
          "Build confidence for all three speaking parts through real-life topics, pronunciation practice, and mock interviews.",
        lessonCount: 4,
      },
    ],
    whatStudentsReceive: [
      "Live online classes",
      "Recorded lessons",
      "PDF materials",
      "Homework",
      "Teacher feedback",
      "Progress tracking",
    ],
    learningFormat: [
      "Zoom or Google Meet classes",
      "Recorded sessions",
      "Structured modules",
      "Personal guidance from Asma",
    ],
  },
];
