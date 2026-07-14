import { StatusType } from "@/components/portal/shared/StatusBadge";

export const nextLiveClassDetails = {
  title: "Speaking Practice — Part 2",
  course: "Academic IELTS",
  module: "Speaking",
  date: "Wednesday, 22 July 2026",
  time: "6:00 PM – 7:00 PM",
  duration: "60 minutes",
  platform: "Google Meet",
  teacher: "Asma",
  status: "Upcoming" as StatusType,
  url: "https://meet.google.com/mock-url-xyz",
  description: "Join us for an interactive speaking session focused on Part 2 of the IELTS Speaking test. We will practice analyzing cue cards, taking effective notes during the 1-minute prep time, and speaking fluently for a full 2 minutes.",
  objectives: [
    "Understand the structure of Part 2 of the speaking test.",
    "Learn brainstorming techniques for the 1-minute prep.",
    "Practice using cohesive devices to link ideas naturally."
  ],
  preparation: "Please review the common cue card topics in Module 5 before joining the session. Have a notebook and pen ready for the 1-minute prep exercise.",
  materialsUrl: "/student-portal/resources/speaking-cue-cards-part2.pdf"
};

export const upcomingClasses = [
  {
    id: 1,
    title: "Listening Section 3 Practice",
    module: "Listening",
    date: "Friday, 24 July 2026",
    time: "5:00 PM – 6:00 PM",
    platform: "Zoom",
    status: "Upcoming" as StatusType,
  },
  {
    id: 2,
    title: "Writing Task 2 Structure",
    module: "Writing",
    date: "Monday, 27 July 2026",
    time: "6:00 PM – 7:30 PM",
    platform: "Google Meet",
    status: "Upcoming" as StatusType,
  },
  {
    id: 3,
    title: "Reading: Matching Headings",
    module: "Reading",
    date: "Wednesday, 29 July 2026",
    time: "6:00 PM – 7:00 PM",
    platform: "Google Meet",
    status: "Upcoming" as StatusType,
  }
];

export const pastClasses = [
  {
    id: 4,
    title: "Writing Task 1 Overview",
    module: "Writing",
    date: "Monday, 20 July 2026",
    status: "Completed" as StatusType,
    hasRecording: true,
  },
  {
    id: 5,
    title: "Speaking Practice — Part 1",
    module: "Speaking",
    date: "Wednesday, 15 July 2026",
    status: "Completed" as StatusType,
    hasRecording: true,
  },
  {
    id: 6,
    title: "Listening Section 1 & 2",
    module: "Listening",
    date: "Friday, 10 July 2026",
    status: "Completed" as StatusType,
    hasRecording: false,
  },
];

export const cancelledRescheduledClasses = [
  {
    id: 7,
    title: "Reading: True/False/Not Given",
    module: "Reading",
    date: "Friday, 31 July 2026",
    time: "5:00 PM – 6:00 PM",
    platform: "Zoom",
    status: "Rescheduled" as StatusType,
    message: "Rescheduled to Monday, 3 August 2026 at 6:00 PM.",
  },
  {
    id: 8,
    title: "Grammar Workshop",
    module: "General",
    date: "Saturday, 1 August 2026",
    time: "10:00 AM – 11:30 AM",
    platform: "Google Meet",
    status: "Cancelled" as StatusType,
    message: "Teacher is unavailable due to an emergency. Will be rescheduled soon.",
  }
];
