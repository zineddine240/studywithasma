export interface StudyAbroadService {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: "Compass" | "GraduationCap" | "FileCheck" | "Award" | "Plane" | "Shield";
  tag: string;
  deliverables: string[];
}

export const STUDY_ABROAD_SERVICES: StudyAbroadService[] = [
  {
    id: "university-matching",
    title: "University & Course Matching",
    shortDesc: "Strategic institution selection tailored to your GPA, budget, career aspirations, and language score.",
    fullDesc:
      "We analyze your complete academic history, career objectives, and financial parameters to build a balanced shortlist of target, match, and safety universities in premier European destinations: France and Italy.",
    iconName: "Compass",
    tag: "Strategic Planning",
    deliverables: [
      "Comparative shortlist of 4–6 accredited universities",
      "Analysis of entry requirements and grade conversion",
      "Detailed tuition and realistic cost of living projections",
      "Evaluation of post-study work visa eligibility",
    ],
  },
  {
    id: "ielts-readiness",
    title: "Targeted IELTS & English Prep",
    shortDesc: "Bridge the exact language gap needed to convert conditional university offers into full admissions.",
    fullDesc:
      "Asma's signature IELTS program gives you the exact skills, writing correction, and speaking practice needed to achieve Band 6.5–7.5+, satisfying both university admission boards and national student visa thresholds.",
    iconName: "GraduationCap",
    tag: "Core Academic Skill",
    deliverables: [
      "Diagnostic baseline level assessment",
      "Live interactive classes or high-definition recorded lessons",
      "Line-by-line examiner feedback on writing tasks",
      "Fluency and pronunciation mock speaking practice",
    ],
  },
  {
    id: "application-dossier",
    title: "Application & SOP Guidance",
    shortDesc: "Craft compelling Statements of Purpose, structured CVs, and certified dossier submissions.",
    fullDesc:
      "Admissions committees read thousands of essays. We provide professional editorial guidance to ensure your Statement of Purpose (SOP) articulates your genuine passion, academic readiness, and long-term trajectory with exceptional clarity.",
    iconName: "FileCheck",
    tag: "Admissions Excellence",
    deliverables: [
      "Personalized Statement of Purpose structure and review",
      "Academic CV formatting adhering to international standards",
      "Letter of Recommendation guidelines for professors and employers",
      "Direct guidance for UCAS, uni-assist, and university portals",
    ],
  },
  {
    id: "scholarship-navigation",
    title: "Scholarship & Funding Advisory",
    shortDesc: "Identify eligible faculty merit awards, international bursaries, and government grant schemes.",
    fullDesc:
      "Many universities offer partial merit awards between £2,000 and £8,000 to high-achieving international applicants. We help you identify deadlines, craft targeted scholarship essays, and assemble prerequisite materials early.",
    iconName: "Award",
    tag: "Financial Planning",
    deliverables: [
      "Search and mapping of verified institutional scholarships",
      "Draft review for scholarship personal statements",
      "Timeline and submission calendar for early funding deadlines",
      "Guidance on government subsidies (e.g., French CAF housing support)",
    ],
  },
  {
    id: "visa-guidance",
    title: "Student Visa Process Guidance",
    shortDesc: "Navigate official visa application portals, financial proof requirements, and biometric filings.",
    fullDesc:
      "Understanding official requirements from UKVI, IRCC, Campus France, or German foreign offices is essential to prevent costly refusals. We walk you through every official documentation checklist and financial proof standard.",
    iconName: "Shield",
    tag: "Compliance & Security",
    deliverables: [
      "Official government checklist breakdown (CAS, LOA, Sperrkonto)",
      "Financial sufficiency calculation and proof-of-funds verification",
      "Guidance on medical clearance, IHS, and biometric appointments",
      "Pre-interview preparation for consular or visa officer questions",
    ],
  },
  {
    id: "pre-departure",
    title: "Pre-Departure & Accommodation",
    shortDesc: "Transition smoothly with student housing advice, healthcare registration, and packing guidance.",
    fullDesc:
      "Arriving in a foreign country should feel exciting, not overwhelming. We provide practical guidance on booking university dorms or private student halls, opening international student bank accounts, and setting up SIM cards.",
    iconName: "Plane",
    tag: "Arrival Support",
    deliverables: [
      "Student housing portals and verified accommodation resources",
      "Guidance on international student bank accounts and SIM cards",
      "Comprehensive airport arrival and orientation checklist",
      "Ongoing check-ins during your first academic semester",
    ],
  },
];

export const GENERAL_FAQS = [
  {
    question: "How do IELTS preparation and study abroad guidance work together?",
    answer:
      "Language proficiency is the foundation of international admissions. Without the required IELTS score (typically 6.5 or 7.0), universities cannot issue unconditional acceptance letters, and visas cannot be finalized. By studying with Asma, you prepare your English language skills while simultaneously researching destinations, preparing your application dossier, and meeting scholarship deadlines.",
  },
  {
    question: "Do you guarantee university admissions or student visas?",
    answer:
      "No ethical educator or consultant guarantees admissions or visas. University admissions and student visas are granted exclusively by the respective university faculties and sovereign immigration authorities. Our role is to provide expert, verified preparation: optimizing your applications, maximizing your IELTS band score, ensuring total document compliance, and presenting your academic profile in the strongest possible light.",
  },
  {
    question: "What destinations does Study With Asma provide guidance for?",
    answer:
      "We currently specialize in premier European destinations: France and Italy. By focusing on these two countries, we provide deep, accurate guidance tailored to their national application portals (Campus France / Études en France and Universitaly), English-taught degree options, regional scholarship systems (such as DSU in Italy and CAF in France), and student visa pathways. Additional destinations will be added later as our advisory services expand.",
  },
  {
    question: "When should I begin preparing for studying abroad?",
    answer:
      "Ideally, you should start 9 to 12 months before your target intake (e.g., in September/October for a September intake the following year). This provides ample time to prepare and take your IELTS exam, research universities, submit early for scholarships, receive offers, and process your student visa without stress.",
  },
  {
    question: "Can I enroll in just IELTS preparation without study abroad consulting?",
    answer:
      "Absolutely. Many of our students enroll strictly for IELTS Academic or General Training preparation to meet immigration, employment, or personal development targets. You can choose either service or combine both.",
  },
  {
    question: "How do I book an initial consultation with Asma?",
    answer:
      "You can fill out our consultation request form on the Contact page or send a message directly to our official WhatsApp (+213 797 32 87 45). We review your academic background, current English level, and study goals to schedule an exploratory session.",
  },
];
