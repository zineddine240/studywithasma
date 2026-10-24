export interface ArticleSection {
  heading: string;
  body: string[];
  tips?: string[];
}

export interface ResourceArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: "IELTS Preparation" | "Study Abroad" | "Scholarships" | "University Admissions";
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
  };
  heroImage: string;
  featured?: boolean;
  sections: ArticleSection[];
  keyTakeaways: string[];
}

export const ARTICLES: ResourceArticle[] = [
  {
    slug: "ielts-band-score-guide-study-abroad",
    title: "Understanding IELTS Band Requirements for Top Universities in 2026",
    excerpt: "What score do you actually need for undergraduate and postgraduate admissions in France and Italy? A realistic breakdown by discipline.",
    category: "IELTS Preparation",
    readTime: "6 min read",
    publishDate: "October 2025",
    author: {
      name: "Asma",
      role: "Senior IELTS Trainer & Education Consultant",
    },
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    keyTakeaways: [
      "Most top 100 universities demand a minimum overall band of 6.5 with at least 6.0 in every sub-skill.",
      "Competitive courses like Law, Medicine, and English Literature often require band 7.0 or 7.5.",
      "A weak writing or speaking band is the #1 reason conditional offers are not converted to unconditional offers.",
      "Preparing early (3-6 months in advance) prevents last-minute retakes that jeopardize visa intake deadlines.",
    ],
    sections: [
      {
        heading: "The Crucial Role of IELTS in University Admissions",
        body: [
          "When admissions officers review applications from international students, their primary objective regarding language is ensuring you can handle rigorous academic discourse: reading dense research papers, writing cohesive 3,000-word essays, understanding complex lecture delivery, and contributing actively in seminars.",
          "While overall band scores are headline numbers, most universities enforce strict sub-band criteria. Scoring an overall 7.0 with a 5.5 in writing will still disqualify you from many premier programs without a mandatory pre-sessional English course.",
        ],
      },
      {
        heading: "Breakdown for France and Italy",
        body: [
          "France: English-taught Master's degrees commonly set their entry requirement at IELTS 6.0 to 6.5 overall. Top-ranked Business Schools (Grandes Écoles like ESSEC or HEC) frequently recommend 7.0 for competitive scholarship assessment.",
          "Italy: Premier public technical and research universities (such as Politecnico di Milano, University of Bologna, and Sapienza) require an overall IELTS band of 6.0 to 6.5 for English-taught Master's programs.",
          "Strategic Advantage: Taking IELTS opens doors to 100% English-taught degree admissions in both countries without requiring prior mastery of French or Italian for initial acceptance.",
        ],
        tips: [
          "Always verify whether your chosen faculty has higher language requirements than the general university admission office.",
          "Keep in mind that IELTS results are valid for exactly 2 years from test date.",
        ],
      },
      {
        heading: "How to Avoid the 6.5 Score Plateau",
        body: [
          "Many candidates find themselves repeatedly trapped between 6.0 and 6.5. This happens when candidates continue memorizing templates instead of mastering grammatical flexibility and precise academic vocabulary.",
          "In writing Task 2, examiners evaluate your ability to develop nuanced arguments with clear progression. In speaking, fluency and natural discourse markers outweigh rehearsed artificial idioms. Focus on error correction with an experienced mentor rather than taking mock test after mock test blindly.",
        ],
      },
    ],
  },
  {
    slug: "studying-in-france-vs-italy-comparison",
    title: "Studying in France vs. Italy: Which European Destination Suits You Best?",
    excerpt: "Comparing English-taught programs, tuition fees, Campus France vs Universitaly portals, regional scholarships (DSU & CAF), and post-study opportunities.",
    category: "Study Abroad",
    readTime: "7 min read",
    publishDate: "October 2025",
    author: {
      name: "Asma",
      role: "Senior IELTS Trainer & Education Consultant",
    },
    heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    keyTakeaways: [
      "Both France and Italy offer extensive public university degrees taught 100% in English with no local language test required for admission.",
      "Public tuition in both countries is exceptionally affordable compared to Anglophone systems: France charges ~€2,770–€3,770/yr, while Italy charges ~€900–€4,000/yr (often reduced based on family income via ISEE).",
      "Italy's regional DSU scholarships can provide 100% tuition waivers plus cash living stipends up to €7,000/yr, while France provides CAF housing allowances subsidizing up to 40% of rent.",
      "Both countries provide post-study job seeker permits (APS in France, Permesso per Ricerca Lavoro in Italy) allowing 1 to 2 years to secure qualified employment.",
    ],
    sections: [
      {
        heading: "Tuition Fees and Financial Aid: CAF vs. DSU",
        body: [
          "France and Italy are two of the most financially advantageous study destinations in Europe. In France, international students benefit from CAF (Caisse d'Allocations Familiales), a government subsidy that refunds up to 30% to 40% of monthly housing rent directly to students.",
          "In Italy, public university tuition is calibrated to your family's financial index (ISEE Parificato). Furthermore, regional scholarships (such as DSU in Tuscany, Lombardy, or Lazio) grant qualifying international students complete tuition waivers, free cafeteria meals, and annual cash stipends of €6,000 to €7,000.",
        ],
      },
      {
        heading: "Application Portals: Campus France vs. Universitaly",
        body: [
          "France requires students from many countries to submit their applications through the centralized Études en France (Campus France) platform, which includes an academic motivational interview.",
          "Italy follows a two-tiered system: you first apply directly to individual universities (Politecnico di Milano, Bologna, Sapienza, etc.). Once admitted, you complete official pre-enrollment on the Universitaly portal, which validates your credentials with the Italian Embassy for visa issuance.",
        ],
      },
      {
        heading: "English-Taught Offerings and Language Reality",
        body: [
          "Both countries host hundreds of Master's degrees taught completely in English. An IELTS score of 6.0 to 6.5 is universally accepted as proof of English capability.",
          "While your university studies will be entirely in English, learning basic conversational French or Italian will immensely enrich your social life and open doors to local internships and networking.",
        ],
      },
    ],
  },
  {
    slug: "ielts-writing-task-2-common-mistakes",
    title: "5 IELTS Writing Task 2 Mistakes That Keep You Stuck at Band 6.5",
    excerpt: "Examiner insights into task response, paragraph coherence, lexical resource, and grammatical accuracy for candidates aiming for Band 7.5 and above.",
    category: "IELTS Preparation",
    readTime: "7 min read",
    publishDate: "October 2025",
    author: {
      name: "Asma",
      role: "Senior IELTS Trainer & Education Consultant",
    },
    heroImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    keyTakeaways: [
      "Mistake 1: Only addressing half of the prompt or giving unbalanced treatment to discussion questions.",
      "Mistake 2: Overusing robotic linking devices ('Moreover', 'Furthermore', 'In a nutshell') rather than natural cohesive flow.",
      "Mistake 3: Throwing in high-level vocabulary without understanding precise contextual collocation.",
      "Mistake 4: Writing essays with excessive ideas but insufficient explanation and supporting illustration.",
    ],
    sections: [
      {
        heading: "1. Incomplete Task Response",
        body: [
          "To score a Band 7 or higher in Task Response, you must address all parts of the task and present a clear position throughout the response.",
          "If the question asks: 'Discuss both views and give your opinion', spending three paragraphs on View A, one brief sentence on View B, and forgetting to clarify your own stance in the introduction will immediately cap your score at Band 6.",
        ],
      },
      {
        heading: "2. The 'Thesaurus Syndrome' (Vocabulary Misuse)",
        body: [
          "Band 8 candidates do not use obscure 18th-century vocabulary; they use natural, precise academic collocations. For example, writing 'myriad of obstacles' or 'deleterious ramifications' inappropriately feels unnatural and signals memorization.",
          "Examiners reward flexible, accurate use of topic-specific vocabulary (e.g., 'sustainable infrastructure', 'fiscal incentives', 'socioeconomic disparity') used with correct prepositions and word forms.",
        ],
      },
      {
        heading: "3. Shallow Paragraph Development",
        body: [
          "A strong body paragraph should follow a clear structure: Topic Sentence -> Explanation (Why/How) -> Concrete Example -> Result or Significance.",
          "Listing four distinct reasons in one paragraph without elaborating on any of them prevents your argument from reaching Band 7+ depth. Quality and depth always defeat quantity in IELTS writing.",
        ],
      },
    ],
  },
  {
    slug: "scholarships-for-international-students-guide",
    title: "How to Find and Apply for Merit-Based Study Abroad Scholarships",
    excerpt: "A systematic approach to identifying government, university, and private funding opportunities, crafting personal statements, and submitting before early deadlines.",
    category: "Scholarships",
    readTime: "9 min read",
    publishDate: "October 2025",
    author: {
      name: "Asma",
      role: "Senior IELTS Trainer & Education Consultant",
    },
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    keyTakeaways: [
      "University automatic merit scholarships (typically £2,000 to £8,000 / €2,500 to €5,000) are assessed with your main admission application.",
      "Prestigious full-funding scholarships (e.g. Eiffel Excellence in France, DSU in Italy) have early deadlines—often 8 to 11 months before your course starts.",
      "High IELTS scores (Band 7.0–8.0) and a cohesive narrative linking past achievements to future societal impact are fundamental.",
    ],
    sections: [
      {
        heading: "Understanding the Three Categories of Scholarships",
        body: [
          "1. Government-Funded Scholarships: Flagship schemes like Eiffel Excellence (France) and DSU Regional Grants (Italy). These generally cover full tuition waivers, subsidized housing, and monthly living stipends.",
          "2. University Faculty Merit Awards: Partial tuition discounts awarded to the top 10-15% of admitted international cohorts based on GPA and background.",
          "3. External Foundation Grants: Non-governmental organizations and corporate fellowships supporting specific research disciplines or regional talent.",
        ],
      },
      {
        heading: "The Golden Rule: Deadlines Precede Course Start by 9 Months",
        body: [
          "The most common mistake international students make is looking for funding in June for a September intake. By June, major scholarship committees have already finalized awardees.",
          "Major scholarship portals open between August and November of the prior year. To apply successfully, your academic transcripts and IELTS certificate should be ready by October at the latest.",
        ],
      },
      {
        heading: "Crafting a Winning Statement of Purpose",
        body: [
          "Scholarship reviewers look for three things: academic excellence, leadership capacity, and a clear vision for how this qualification will create tangible impact upon graduation.",
          "Avoid generic statements such as 'Since childhood I have loved technology'. Instead, pinpoint a specific challenge in your country or industry, demonstrate what you have already done to address it, and explain why this particular degree is the catalyst you need.",
        ],
      },
    ],
  },
];

export function getAllArticles(): ResourceArticle[] {
  return ARTICLES;
}

export function getArticleBySlug(slug: string): ResourceArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
