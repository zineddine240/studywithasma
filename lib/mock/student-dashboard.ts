import { StatusType } from "@/components/portal/shared/StatusBadge";

export const studentData = {
  name: "Sarah Ahmed",
  course: "Academic IELTS",
  group: "Academic Group A",
  targetBand: "6.5",
  courseProgress: 48,
  lessonsCompleted: 12,
  totalLessons: 25,
  assignmentsSubmitted: 5,
  feedbackReceived: 4,
};

export const nextLiveClass = {
  title: "Speaking Practice",
  module: "Speaking",
  date: "Wednesday, 6:00 PM",
  platform: "Google Meet",
  status: "Upcoming" as StatusType,
  url: "https://meet.google.com/mock-url-xyz",
};

export const continueLearning = {
  module: "Module 3: Reading",
  lesson: "Lesson 2: True, False, Not Given",
  progress: 48,
};

export const courseModules = [
  {
    title: "Module 1: Introduction",
    description: "Understand the IELTS format, assessment criteria, and study plan.",
    slug: "introduction",
    lessons: 3,
    progress: 100,
    status: "Completed" as StatusType,
  },
  {
    title: "Module 2: Listening",
    description: "Develop listening strategies for all four sections of the IELTS test.",
    slug: "listening",
    lessons: 6,
    progress: 100,
    status: "Completed" as StatusType,
  },
  {
    title: "Module 3: Reading",
    description: "Practice question types, time management, and reading techniques.",
    slug: "reading",
    lessons: 6,
    progress: 50,
    status: "In Progress" as StatusType,
  },
  {
    title: "Module 4: Writing",
    description: "Learn how to structure and improve IELTS Writing Task 1 and Task 2 responses.",
    slug: "writing",
    lessons: 6,
    progress: 0,
    status: "Not Started" as StatusType,
  },
  {
    title: "Module 5: Speaking",
    description: "Develop fluency, pronunciation, vocabulary, and confidence for the speaking test.",
    slug: "speaking",
    lessons: 4,
    progress: 0,
    status: "Not Started" as StatusType,
  },
];

export const recentLessons = [
  {
    id: 1,
    title: "Writing Task 2: Opinion Essay",
    module: "Writing",
    duration: "45 min",
    publishedDate: "Yesterday",
    status: "Not Started" as StatusType,
  },
  {
    id: 2,
    title: "Listening Section 3 Strategies",
    module: "Listening",
    duration: "50 min",
    publishedDate: "Oct 12",
    status: "Completed" as StatusType,
  },
  {
    id: 3,
    title: "Reading: True, False, Not Given",
    module: "Reading",
    duration: "40 min",
    publishedDate: "Oct 10",
    status: "Completed" as StatusType,
  },
];

export const pendingHomework = {
  title: "Writing Task 2 Essay",
  dueDate: "Tomorrow, 11:59 PM",
  status: "Not Submitted" as StatusType,
};

export const latestFeedback = {
  assignment: "Writing Task 1",
  estimatedBand: "6.0",
  comment: "Good structure. Focus on grammar accuracy and clearer comparisons.",
};

export const announcements = [
  {
    id: 1,
    message: "New Speaking Practice class added for Wednesday.",
  },
  {
    id: 2,
    message: "Writing Task 2 homework is due this Friday.",
  },
];
