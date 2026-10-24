export interface Destination {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  flag: string; // unicode or emoji/code
  tagline: string;
  popularFor: string;
  heroImage: string;
  cardImage: string;
  accentColor: string;
  stats: {
    avgTuition: string;
    livingCost: string;
    postStudyWork: string;
    intakeMonths: string;
  };
  overview: string;
  highlights: string[];
  studyOpportunities: {
    level: string;
    description: string;
    topFields: string[];
  }[];
  entryRequirements: {
    academic: string;
    englishRequirements: {
      exam: string;
      undergraduate: string;
      postgraduate: string;
      notes: string;
    };
    documentsRequired: string[];
  };
  estimatedCosts: {
    academicYear: string;
    tuitionRange: string;
    livingExpenses: string;
    healthInsurance: string;
    disclaimer: string;
  };
  applicationProcess: {
    step: number;
    title: string;
    description: string;
  }[];
  popularUniversities: {
    name: string;
    city: string;
    type: string;
  }[];
  officialResources: {
    title: string;
    url: string;
    organization: string;
  }[];
}

export const DESTINATIONS: Destination[] = [
  {
    id: "france",
    slug: "france",
    name: "France",
    shortName: "France",
    flag: "🇫🇷",
    tagline: "Study in a safe, welcoming country known for subsidized tuition and hundreds of English-taught programs.",
    popularFor: "English-Taught Master's & Affordable Public Education",
    heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1509299349698-dd22323b5963?q=80&w=800&auto=format&fit=crop",
    accentColor: "#2563EB",
    stats: {
      avgTuition: "€2,770 - €15,000 / yr",
      livingCost: "€800 - €1,300 / mo",
      postStudyWork: "1 to 2 Years (APS / Carte Séjour)",
      intakeMonths: "Sept / Oct (Main intake)",
    },
    overview:
      "France is one of Europe's top destinations for international students, with over 1,500 programs taught entirely in English. From world-leading Business Schools (Grandes Écoles like HEC, INSEAD, ESSEC) to historic public research universities, students enjoy state-subsidized healthcare, transport discounts, and government housing assistance (CAF).",
    highlights: [
      "Over 1,500 programs fully taught in English across Master's and MBA levels.",
      "French government housing allowance (CAF) reimburses up to 30-40% of monthly student rent.",
      "Low tuition at public universities and top-tier global rankings for business and management.",
      "Access to Schengen zone travel and 1-2 year post-study job search visa (APS / Recherche d'emploi).",
    ],
    studyOpportunities: [
      {
        level: "Master of Science (MSc) & MIM",
        description: "1 to 2-year English-taught management, technology, and engineering degrees.",
        topFields: ["Luxury Brand Management", "Data Analytics & AI", "International Business", "Computer Engineering"],
      },
      {
        level: "Public University Master's",
        description: "Research-driven academic master's programs with affordable national tuition rates.",
        topFields: ["Applied Mathematics", "Economics", "Sustainable Development", "Life Sciences"],
      },
    ],
    entryRequirements: {
      academic: "Undergraduate: High school diploma / Baccalaureate with strong grades. Master's: 3 or 4-year Bachelor degree (Licence or equivalent) with minimum 11-13/20 average.",
      englishRequirements: {
        exam: "IELTS Academic",
        undergraduate: "Overall 6.0 (no band below 5.5)",
        postgraduate: "Overall 6.5 (minimum 6.0 in all components)",
        notes: "No French language requirement for 100% English-taught programs, though learning conversational French is highly encouraged.",
      },
      documentsRequired: [
        "Certified translated university transcripts and degree certificates",
        "Official IELTS Academic score report",
        "CV in European format",
        "Motivation letter explaining academic & professional rationale",
        "Two letters of recommendation",
        "Passport scan and proof of financial resources (€615/month minimum)",
      ],
    },
    estimatedCosts: {
      academicYear: "2025 / 2026 Estimated Averages",
      tuitionRange: "€2,770 to €3,770/year at public universities (higher for private Business Schools: €10,000 - €18,000/year)",
      livingExpenses: "€800 to €1,300/month (Paris: ~€1,200+, regional cities: ~€800 - €950/month)",
      healthInsurance: "Free enrollment in French national social security (Sécurité Sociale Étudiante)",
      disclaimer: "France provides notable student subsidies (CAF housing allowance, student transit passes, campus dining for €1 - €3.30).",
    },
    applicationProcess: [
      {
        step: 1,
        title: "Program Research & Language Readiness",
        description: "Select certified English-taught programs via Campus France catalog and prepare for your IELTS exam.",
      },
      {
        step: 2,
        title: "Campus France Dossier (Études en France)",
        description: "Submit online application through the official Études en France platform or direct school portal.",
      },
      {
        step: 3,
        title: "Academic Interview / School Review",
        description: "Attend motivational interview with Campus France and university admissions committee.",
      },
      {
        step: 4,
        title: "Admission Letter & Deposit",
        description: "Receive formal admission attestation and make required tuition deposit.",
      },
      {
        step: 5,
        title: "VLS-TS Long-Stay Student Visa",
        description: "Apply for Long-Stay Visa via France-Visas with financial attestation and housing certificate.",
      },
    ],
    popularUniversities: [
      { name: "Sorbonne University", city: "Paris", type: "Historic World Top Tier University" },
      { name: "Université Paris-Saclay", city: "Paris-Saclay", type: "World #1 for Mathematics" },
      { name: "ESSEC Business School", city: "Cergy / Paris", type: "Top 5 Global Master in Management" },
      { name: "Grenoble INP / UGA", city: "Grenoble", type: "Leading Science & Technology Cluster" },
      { name: "Sciences Po", city: "Paris", type: "Elite Social Sciences Institution" },
    ],
    officialResources: [
      { title: "Campus France Official Catalog", url: "https://www.campusfrance.org", organization: "French Ministry of Higher Education" },
      { title: "France-Visas Official Portal", url: "https://france-visas.gouv.fr", organization: "Government of France" },
    ],
  },
  {
    id: "italy",
    slug: "italy",
    name: "Italy",
    shortName: "Italy",
    flag: "🇮🇹",
    tagline: "Enjoy high-quality education, vibrant student life, and generous DSU scholarship opportunities.",
    popularFor: "Affordable Public Tuition & DSU Regional Scholarships",
    heroImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1600&auto=format&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop",
    accentColor: "#15803D",
    stats: {
      avgTuition: "€900 - €4,000 / yr (Public Universities)",
      livingCost: "€700 - €1,100 / mo",
      postStudyWork: "1 Year (Permesso per Ricerca Lavoro)",
      intakeMonths: "Sept / Oct (Main intake)",
    },
    overview:
      "Italy is one of the most culturally inspiring and cost-effective higher education destinations in Europe. Home to the world's oldest university (University of Bologna, founded 1088) and premier engineering powerhouses like Politecnico di Milano, Italy offers more than 500 accredited degrees taught entirely in English. Public university tuition is scaled by family income (ISEE Parificato), and regional government scholarships (DSU) provide full tuition waivers, subsidized accommodation, and cash stipends.",
    highlights: [
      "Tuition fees at public universities typically range from €900 to €4,000/year, with generous income-based fee reductions (ISEE).",
      "Regional DSU scholarships provide full tuition waivers, subsidized student dining, free dorms, and annual living stipends of up to €6,000 - €7,000.",
      "Over 500 undergraduate and postgraduate programs taught completely in English across engineering, design, medicine, business, and data science.",
      "1-year post-study residence permit (Permesso di Soggiorno per Ricerca Lavoro o Imprenditorialità) for graduates to seek qualified work in Italy and the European Union.",
    ],
    studyOpportunities: [
      {
        level: "Master's Degree (Laurea Magistrale)",
        description: "2-year rigorous graduate programs with coursework, industrial research, and a thesis defense.",
        topFields: ["Architecture & Urban Planning", "Computer Engineering & AI", "Fashion & Luxury Management", "Biomedical Sciences", "Economics & Finance"],
      },
      {
        level: "Bachelor's Degree (Laurea Triennale)",
        description: "3-year undergraduate foundation degrees taught in English at leading public and private academies.",
        topFields: ["Global Governance", "Business Administration", "Automotive Engineering", "Data Analytics"],
      },
    ],
    entryRequirements: {
      academic: "Undergraduate: Minimum 12 years of formal schooling (high school diploma / Baccalaureate). Master's: 3 or 4-year Bachelor degree from a recognized university with relevant curriculum credit alignment.",
      englishRequirements: {
        exam: "IELTS Academic (or recognized equivalent)",
        undergraduate: "Overall 6.0 (minimum 5.5 in each section)",
        postgraduate: "Overall 6.0 – 6.5 (depending on faculty and university tier)",
        notes: "No Italian language requirement for 100% English-taught programs. Basic conversational Italian is recommended for day-to-day life and internships.",
      },
      documentsRequired: [
        "Declaration of Value (DOV) from Italian Embassy or CIMEA Statement of Comparability & Verification",
        "Certified translated university transcripts and official degree certificates",
        "Official IELTS Academic score certificate",
        "Curriculum Vitae (Europass format recommended)",
        "Statement of Purpose / Motivation Letter",
        "Two letters of academic or professional recommendation",
        "Universitaly pre-enrollment summary and confirmation",
        "Proof of financial sufficiency (statutory visa threshold ~€6,000/year) and accommodation voucher",
      ],
    },
    estimatedCosts: {
      academicYear: "2025 / 2026 Estimated Averages",
      tuitionRange: "€900 to €4,000 per year at public universities (income-adjusted via ISEE); private universities range from €8,000 to €20,000/year",
      livingExpenses: "€700 to €1,100 per month (Milan & Rome: ~€900–€1,200/mo; student cities like Bologna, Padua, or Turin: ~€650–€900/mo)",
      healthInsurance: "Approx. €150 to €700 per year (registration with Italian National Health Service - SSN / Tessera Sanitaria)",
      disclaimer: "Figures reflect 2025/2026 estimates. DSU regional scholarship recipients receive 100% tuition exemption, subsidized cafeteria access, and living cost grants.",
    },
    applicationProcess: [
      {
        step: 1,
        title: "Program Selection & Deadline Verification",
        description: "Identify accredited English-taught degrees and verify departmental application windows (typically December through April).",
      },
      {
        step: 2,
        title: "IELTS Academic Readiness",
        description: "Achieve the required band 6.0–6.5 with Asma's targeted coaching and feedback.",
      },
      {
        step: 3,
        title: "University Admission Submission",
        description: "Submit certified dossiers, motivation letter, CV, and academic transcripts directly to university portals.",
      },
      {
        step: 4,
        title: "Pre-Enrollment on Universitaly",
        description: "Upon receiving your admission offer, complete pre-enrollment on the official Italian government Universitaly portal for embassy visa clearance.",
      },
      {
        step: 5,
        title: "CIMEA / DOV & Regional DSU Application",
        description: "Obtain CIMEA academic comparability certificate and submit your regional scholarship (DSU) application for tuition waiver.",
      },
      {
        step: 6,
        title: "Italian National Student Visa (Type D)",
        description: "Lodge visa application with your Universitaly summary, health insurance, and verified financial proof.",
      },
    ],
    popularUniversities: [
      { name: "Politecnico di Milano", city: "Milan", type: "Italy's #1 Technical University & Global Top 20 for Engineering" },
      { name: "University of Bologna (UNIBO)", city: "Bologna", type: "World's Oldest University (Founded 1088) with Extensive English Offerings" },
      { name: "Sapienza University of Rome", city: "Rome", type: "Historic Capital Giant & Global Research Leader" },
      { name: "Politecnico di Torino", city: "Turin", type: "Premier Automotive, Aerospace & Engineering Center" },
      { name: "University of Padua", city: "Padua", type: "Historic Research Institution (Founded 1222)" },
    ],
    officialResources: [
      { title: "Universitaly Official Portal", url: "https://www.universitaly.it", organization: "Italian Ministry of University and Research (MUR)" },
      { title: "Study in Italy Official Guide", url: "https://studyinitaly.esteri.it", organization: "Ministry of Foreign Affairs and International Cooperation" },
      { title: "CIMEA - Academic Recognition Portal", url: "https://www.cimea.it/en", organization: "CIMEA Italy" },
    ],
  },
];

export function getAllDestinations(): Destination[] {
  return DESTINATIONS;
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
