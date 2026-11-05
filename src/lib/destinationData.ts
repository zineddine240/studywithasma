export interface ApplicationProcedure {
  name: string;
  code: string;
  eligibleFor: string[];
  deadlines: { label: string; date: string }[];
}

export interface FranceCampusInfo {
  applicationCampaign: string;
  campusFranceOpens: string;
  mainIntake: string;
  applicationPlatform: string;
  higherEdSystem: string;
  lmdStructure: { level: string; duration: string }[];
  whyFrance: string[];
  frenchLanguageRequirements: {
    minimumLevel: string;
    institutionLevel: string;
    recommendedForHumanities: string;
    acceptedCertifications: string[];
    note: string;
  };
  applicationProcedures: ApplicationProcedure[];
  standardTuitionFees?: {
    licence: string;
    master: string;
    doctorate: string;
    note: string;
  };
  applicationFees: {
    full: string;
    reduced: string;
    reducedNote: string;
    note: string;
  };
  visaInfo: {
    type: string;
    platform: string;
    financialRequirement: string;
    notes: string[];
  };
  officialResourcesExtra: { title: string; url: string; organization: string }[];
}

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
  // Optional France-specific rich content
  campusFranceInfo?: FranceCampusInfo;
  italyInfo?: {
    dsuScholarship: {
      title: string;
      maxAmount: string;
      benefits: string[];
      example: string;
      notes: string[];
    };
  };
}

export const DESTINATIONS: Destination[] = [
  {
    id: "france",
    slug: "france",
    name: "France",
    shortName: "France",
    flag: "🇫🇷",
    tagline: "Your Gateway to French Higher Education – 2027/2028 Intake",
    popularFor: "Campus France Algérie – 2027/2028 Intake",
    heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop",
    accentColor: "#2563EB",
    stats: {
      avgTuition: "€178 – €3,950 / yr (Public)",
      livingCost: "€800 – €1,500 / mo",
      postStudyWork: "APS Visa (up to 2 years)",
      intakeMonths: "Sept / Oct 2027",
    },
    overview:
      "France is one of the leading destinations for international students, offering a diverse higher education system combining public universities, Grandes Écoles, engineering schools, business schools and specialised institutions. For Algerian students, applications are managed through the official Campus France Algérie – Études en France procedure. The 2027/2028 campaign opened on 1 October 2026.",
    highlights: [
      "Internationally recognised degrees across Licence, Master and Doctorat (LMD) levels.",
      "Campus France Algérie manages all applications through the Études en France platform.",
      "French government student subsidies: CAF housing allowance, €1–€3.30 student dining.",
      "French and English-taught programmes in engineering, business, law, computer science and more.",
      "Access to Schengen zone travel and post-study APS residence permit.",
      "Student healthcare enrollment in the French national social security system (free for eligible students).",
    ],
    studyOpportunities: [
      {
        level: "Licence – Undergraduate Programmes",
        description: "For Algerian Baccalaureate holders starting university in France. Application via DAP procedure.",
        topFields: ["Computer Science & Mathematics", "Economics & Management", "Law & Political Science", "Biology & Life Sciences", "Engineering Sciences", "Languages & Literature"],
      },
      {
        level: "Master's Degree – Graduate Programmes",
        description: "For Licence holders or equivalent. Application via Études en France (Hors DAP).",
        topFields: ["Artificial Intelligence & Data Science", "International Business & Management", "Finance & Economics", "Computer Engineering", "Translation & Applied Linguistics", "Sustainable Development"],
      },
      {
        level: "Grandes Écoles & Specialised Institutions",
        description: "Prestigious business schools, engineering schools and specialised higher education institutions.",
        topFields: ["Business & Management Schools", "Engineering Schools", "Architecture Schools", "Digital Technology & IT", "Art & Design Schools"],
      },
    ],
    entryRequirements: {
      academic: "Licence 1: Algerian Baccalauréat or equivalent. Licence 2/3: Bac + previous transcripts + proof of academic year completion. Master's: Recognised Licence (Bac+3) or equivalent, transcripts, degree certificate, coherent academic project.",
      englishRequirements: {
        exam: "IELTS Academic (for English-taught programmes)",
        undergraduate: "As required by the institution",
        postgraduate: "As required by the institution",
        notes: "English-language requirements are set by each institution. IELTS, TOEFL or other accepted certificates may be requested for English-taught programmes.",
      },
      documentsRequired: [
        "Algerian Baccalauréat certificate and transcripts",
        "Previous university transcripts (certified and translated)",
        "Degree certificate or provisional achievement certificate",
        "Motivation letter (lettre de motivation)",
        "CV in European format",
        "French language certification (TCF DAP / DELF B2 / DALF C1)",
        "Passport scan and proof of financial resources",
        "Campus France application dossier (Études en France)",
      ],
    },
    estimatedCosts: {
      academicYear: "2026 / 2027 Published Rates",
      tuitionRange: "€178 – €398/yr (standard / exempt) or €2,902 – €3,950/yr (differentiated)",
      livingExpenses: "Regional cities: €800–€1,000/month. Paris & surroundings: €1,100–€1,500+/month",
      healthInsurance: "Free enrollment in French national social security (Sécurité Sociale Étudiante) for eligible international students",
      disclaimer: "Campus France application fee: 20,000 DZD (full) / 10,000 DZD (reduced). Some students may benefit from full or partial tuition exemptions. CAF housing allowance and €1–€3.30 student dining available.",
    },
    applicationProcess: [
      {
        step: 1,
        title: "Academic Assessment & Orientation",
        description: "Evaluate your academic background, language level and professional objectives to identify suitable programmes.",
      },
      {
        step: 2,
        title: "French Language Preparation",
        description: "Prepare for TCF, DELF or DALF certification. English-taught programmes may require IELTS.",
      },
      {
        step: 3,
        title: "University Selection & Document Preparation",
        description: "Identify universities, prepare your CV, motivation letter, academic documents and certified translations.",
      },
      {
        step: 4,
        title: "Études en France Application",
        description: "Create your profile on the Études en France platform and submit the correct procedure (DAP or Hors DAP).",
      },
      {
        step: 5,
        title: "Campus France Interview",
        description: "Attend your Campus France Algérie interview before the 15 March 2027 deadline.",
      },
      {
        step: 6,
        title: "VLS-TS Long-Stay Student Visa",
        description: "Apply for your long-stay student visa via France-Visas with admission proof and financial documents.",
      },
    ],
    popularUniversities: [
      { name: "Sorbonne University", city: "Paris", type: "Historic World Top Tier University" },
      { name: "Université Paris-Saclay", city: "Paris-Saclay", type: "World #1 for Mathematics" },
      { name: "ESSEC Business School", city: "Cergy / Paris", type: "Top 5 Global Master in Management" },
      { name: "Sciences Po", city: "Paris", type: "Elite Social Sciences Institution" },
    ],
    officialResources: [
      { title: "Études en France – Campus France Algérie", url: "https://algerie.campusfrance.org", organization: "Campus France Algérie" },
      { title: "France-Visas Official Portal", url: "https://france-visas.gouv.fr", organization: "Government of France" },
      { title: "Institut Français Algérie", url: "https://www.if-algerie.com", organization: "Institut Français Algérie" },
      { title: "Campus France Official Catalog", url: "https://www.campusfrance.org", organization: "French Ministry of Higher Education" },
    ],
    campusFranceInfo: {
      standardTuitionFees: {
        licence: "€178/year",
        master: "€254/year",
        doctorate: "€398/year",
        note: "These are standard national registration fees (2026/2027) applicable to students benefiting from an exemption from differentiated tuition fees. Algerian students may benefit from full or partial tuition fee exemptions, subject to eligibility and university approval. Exemptions are not automatic.",
      },
      applicationCampaign: "2027/2028",
      campusFranceOpens: "1 October 2026",
      mainIntake: "September / October 2027",
      applicationPlatform: "Études en France – Campus France Algérie",
      higherEdSystem:
        "France's higher education follows the LMD structure: Licence (3 years), Master (2 years after Licence), Doctorat (3 years after Master). Institutions include public universities, Grandes Écoles, engineering schools, business schools and specialised institutions.",
      lmdStructure: [
        { level: "Licence (L)", duration: "3 years of higher education" },
        { level: "Master (M)", duration: "2 years after the Licence" },
        { level: "Doctorat (D)", duration: "3 additional years after a Master's degree" },
      ],
      whyFrance: [
        "Internationally recognised degrees and qualifications.",
        "Wide selection of public universities and specialised institutions.",
        "Programmes available in both French and English.",
        "Student discounts on public transport, restaurants and cultural activities.",
        "Access to student housing assistance (CAF/APL), subject to eligibility.",
        "Opportunities to work part-time under applicable regulations while studying.",
      ],
      frenchLanguageRequirements: {
        minimumLevel: "B1 (Campus France procedure minimum)",
        institutionLevel: "B2 (required by most French institutions)",
        recommendedForHumanities: "C1 (strongly recommended for humanities and social sciences)",
        acceptedCertifications: ["TCF (according to the applicable procedure)", "TCF DAP", "DELF B2", "DALF C1 / C2"],
        note: "Language requirements are determined by the institution and programme. Meeting the Campus France minimum does not automatically guarantee admission.",
      },
      applicationProcedures: [
        {
          name: "DAP – Demande d'Admission Préalable",
          code: "DAP",
          eligibleFor: [
            "First-year Licence (L1) at public universities",
            "Eligible architecture school applications",
          ],
          deadlines: [
            { label: "Application submission deadline", date: "15 December 2026" },
            { label: "Campus France interview deadline", date: "15 March 2027" },
          ],
        },
        {
          name: "Hors DAP – Non-DAP Procedure",
          code: "HORS DAP",
          eligibleFor: [
            "Licence 2 (L2) and Licence 3 (L3)",
            "Licence Professionnelle",
            "Master's programmes (M1 and M2)",
            "Bachelor Universitaire de Technologie (BUT)",
            "Eligible engineering and business schools",
          ],
          deadlines: [
            { label: "Application submission deadline", date: "30 November 2026" },
            { label: "Campus France interview deadline", date: "15 March 2027" },
          ],
        },
      ],
      applicationFees: {
        full: "20,000 DZD",
        reduced: "10,000 DZD",
        reducedNote: "Subject to eligibility",
        note: "The application fee is non-refundable and paid online after submitting the application, normally within 48 hours. Check the official Campus France Algérie fee schedule for exemption conditions.",
      },
      visaInfo: {
        type: "VLS-TS (Visa de Long Séjour valant Titre de Séjour) – Student Category",
        platform: "France-Visas (france-visas.gouv.fr)",
        financialRequirement: "Approx. €877.50/month (financial sufficiency requirement)",
        notes: [
          "Apply after receiving your admission letter and Campus France attestation.",
          "The VLS-TS student visa must be validated online after arrival in France via the ANEF platform.",
          "Post-study: APS (Autorisation Provisoire de Séjour) available to graduates for job search.",
        ],
      },
      officialResourcesExtra: [
        { title: "ANEF Portal (Visa Validation)", url: "https://administration-etrangers-en-france.interieur.gouv.fr", organization: "French Ministry of Interior" },
      ],
    },
  },
  {
    id: "italy",
    slug: "italy",
    name: "Italy",
    shortName: "Italy",
    flag: "🇮🇹",
    tagline: "Top-ranked universities, a rich culture and affordable higher education opportunities.",
    popularFor: "Affordable Public University Education & DSU Regional Scholarships",
    heroImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1600&auto=format&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop",
    accentColor: "#15803D",
    stats: {
      avgTuition: "€157 / yr (Public Registration)",
      livingCost: "€450 – €600 / mo",
      postStudyWork: "Job-Seeking Permit (post-grad)",
      intakeMonths: "Sept / Oct (Main intake)",
    },
    overview:
      "Italy is one of the most culturally inspiring and cost-effective higher education destinations in Europe. Home to the world's oldest university (University of Bologna, founded 1088) and premier engineering powerhouses like Politecnico di Milano, Italy offers more than 500 accredited degrees taught entirely in English. Algerian students benefit from very affordable university registration costs (initial payment around €157) and can access comprehensive regional DSU scholarships offering tuition waivers, free housing, and living grants up to €8,000+ per year.",
    highlights: [
      "Low initial university registration fee of approximately €157/year at public universities.",
      "DSU Regional Scholarships provide up to €8,000+ per year in non-repayable grants, full tuition waivers, free/subsidised student housing, and cafeteria meal vouchers.",
      "Budget-friendly student living costs estimated between €450–€600/month depending on city and shared accommodation.",
      "Over 500 undergraduate and postgraduate programs taught completely in English across engineering, design, medicine, business, and data science.",
      "Possibility of obtaining a residence permit for job seeking after graduation (Permesso per Ricerca Lavoro), subject to applicable requirements.",
      "Internationally recognised degrees fully accredited across the European Higher Education Area (EHEA).",
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
      academic: "Undergraduate: Minimum 12 years of formal schooling (high school diploma / Baccalaureate). Master's: 3 or 4-year Bachelor degree from a recognized university.",
      englishRequirements: {
        exam: "IELTS Academic (or recognized equivalent)",
        undergraduate: "Overall 5.5",
        postgraduate: "Overall 5.5 (B2 level)",
        notes: "No specific minimum score required for individual IELTS components (Listening, Reading, Writing and Speaking), subject to university admission requirements. An overall IELTS score of 5.5 may be accepted by Italian universities for English-taught programmes. Requirements vary depending on the university and chosen degree programme. Always verify specific admission requirements before applying.",
      },
      documentsRequired: [
        "Declaration of Value (DOV) from Italian Embassy or CIMEA Statement of Comparability & Verification",
        "Certified translated university transcripts and official degree certificates",
        "Official IELTS Academic score certificate",
        "Curriculum Vitae (Europass format recommended)",
        "Statement of Purpose / Motivation Letter",
        "Two letters of academic or professional recommendation",
        "Universitaly pre-enrollment summary and confirmation",
        "Proof of financial sufficiency and accommodation voucher",
      ],
    },
    estimatedCosts: {
      academicYear: "2026 / 2027 Estimated Costs",
      tuitionRange: "€157 / year (indicative initial registration payment at public universities)",
      livingExpenses: "€450 – €600 / month (budget-conscious student lifestyle)",
      healthInsurance: "International students must arrange appropriate healthcare coverage and comply with Italian residence requirements (e.g. SSN registration approx. €150–€700/yr)",
      disclaimer: "The €157 registration payment is an indicative initial university registration cost. Additional charges may apply depending on the institution and programme. DSU scholarships are not automatic; applicants must meet financial/academic eligibility requirements and submit documentation within regional deadlines. Scholarship amounts and benefits vary by region. Visa financial sufficiency requirements are separate from monthly living budgets.",
    },
    italyInfo: {
      dsuScholarship: {
        title: "DSU Regional Right-to-Study Scholarships",
        maxAmount: "Up to €8,000+ / year",
        benefits: [
          "Annual financial grants of up to €8,000 or more in direct living support",
          "Full or partial exemption from university tuition and regional fees",
          "Free or subsidised student accommodation (subject to regional availability)",
          "Subsidised or free daily meals at university cafeterias",
        ],
        example: "In Emilia-Romagna, the 2026/2027 ER.GO scholarship reaches €8,246.78 for eligible off-site students in the lowest income bracket.",
        notes: [
          "Eligible Algerian students can apply for regional DSU scholarships based on household income documents (ISEE Parificato).",
          "Deadlines and submission procedures are set regionally (e.g. ER.GO, DiSCo Lazio, Edisu Piemonte, DSU Toscana).",
          "Scholarships are not automatic and require academic progression and documentary proof of family financial standing.",
        ],
      },
    },
    applicationProcess: [
      {
        step: 1,
        title: "Program Selection & Deadline Verification",
        description: "Identify accredited English-taught degrees and verify departmental application windows.",
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
        description: "Upon receiving your admission offer, complete pre-enrollment on Universitaly.",
      },
      {
        step: 5,
        title: "CIMEA / DOV & Regional DSU Application",
        description: "Obtain academic comparability and apply for DSU scholarship grants.",
      },
      {
        step: 6,
        title: "Italian National Student Visa (Type D)",
        description: "Lodge visa application with Universitaly summary and financial proofs.",
      },
    ],
    popularUniversities: [
      { name: "Politecnico di Milano", city: "Milan", type: "Italy's #1 Technical University" },
      { name: "University of Bologna (UNIBO)", city: "Bologna", type: "World's Oldest University (Founded 1088)" },
      { name: "Sapienza University of Rome", city: "Rome", type: "Historic Capital Giant" },
      { name: "Politecnico di Torino", city: "Turin", type: "Premier Automotive & Engineering Center" },
      { name: "University of Padua", city: "Padua", type: "Historic Research Institution (1222)" },
    ],
    officialResources: [
      { title: "Universitaly Official Portal", url: "https://www.universitaly.it", organization: "Italian Ministry of University and Research (MUR)" },
      { title: "Study in Italy Official Guide", url: "https://studyinitaly.esteri.it", organization: "Ministry of Foreign Affairs" },
    ],
  },
  {
    id: "netherlands",
    slug: "netherlands",
    name: "The Netherlands",
    shortName: "Netherlands",
    flag: "🇳🇱",
    tagline: "Pioneering English-Taught Higher Education in Mainland Europe",
    popularFor: "International environment, English-taught programs and innovative education.",
    heroImage: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1200&auto=format&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=800&auto=format&fit=crop",
    accentColor: "from-blue-600 to-indigo-700",
    stats: {
      avgTuition: "€6,000 – €15,000 / yr",
      livingCost: "€900 – €1,400 / mo",
      postStudyWork: "1-Year Zoekjaar Visa",
      intakeMonths: "Sept & Feb",
    },
    overview:
      "The Netherlands was the first non-English-speaking country to offer university degree programs taught entirely in English. Known for interactive problem-based learning, world-renowned technical institutes, and a truly global student body.",
    highlights: [
      "Over 2,100 programs taught 100% in English across all academic disciplines",
      "World-renowned institutions: TU Delft, University of Amsterdam, Wageningen",
      "1-Year 'Orientation Year' (Zoekjaar) post-study work visa for graduates",
      "Global business hub with headquarters of Philips, ASML, Booking.com, and Shell",
    ],
    studyOpportunities: [
      {
        level: "Bachelor's Degrees (HBO & WO)",
        description: "3 to 4-year programs combining theory with applied research and industry internships.",
        topFields: ["Computer Science & AI", "Engineering & Tech", "Business & Finance", "Environmental Science"],
      },
      {
        level: "Master's Degrees",
        description: "1 to 2-year rigorous specialized research programs with high international employer recognition.",
        topFields: ["Data Science", "Supply Chain", "International Law", "Renewable Energy"],
      },
    ],
    entryRequirements: {
      academic: "Recognized secondary diploma or Bachelor's degree with strong GPA transcripts.",
      englishRequirements: {
        exam: "IELTS Academic or TOEFL iBT",
        undergraduate: "6.0 – 6.5 Overall",
        postgraduate: "6.5 – 7.0 Overall",
        notes: "Strict thresholds apply; sub-scores below 6.0 are rarely exempted.",
      },
      documentsRequired: [
        "Certified academic transcripts and diploma copies",
        "Official IELTS Academic score report",
        "Curriculum Vitae (CV) in European format",
        "Statement of Purpose (Motivation Letter)",
        "Letters of Recommendation (Academic/Professional)",
      ],
    },
    estimatedCosts: {
      academicYear: "2026/2027",
      tuitionRange: "€6,000 – €15,000 / year (non-EU)",
      livingExpenses: "€900 – €1,400 / month (housing, food, insurance)",
      healthInsurance: "€50 – €120 / month",
      disclaimer: "Tuition and housing costs vary substantially between major cities (Amsterdam, Utrecht) and university towns (Enschede, Groningen).",
    },
    applicationProcess: [
      { step: 1, title: "Program Selection", description: "Search Studielink and university portals for target courses." },
      { step: 2, title: "Studielink Registration", description: "Create an account on the national Dutch portal (Studielink.nl)." },
      { step: 3, title: "Institutional Application", description: "Submit required portfolio, transcripts, and IELTS score directly to the university." },
      { step: 4, title: "Admission & Visa Handling", description: "Universities apply directly for your MVV/VVR entry visa on your behalf." },
    ],
    popularUniversities: [
      { name: "Delft University of Technology (TU Delft)", city: "Delft", type: "World Top 15 Engineering Powerhouse" },
      { name: "University of Amsterdam (UvA)", city: "Amsterdam", type: "Premier Comprehensive Research University" },
      { name: "Erasmus University Rotterdam", city: "Rotterdam", type: "Top European Business & Management School" },
      { name: "Eindhoven University of Technology", city: "Eindhoven", type: "Brainport High-Tech Innovation Center" },
    ],
    officialResources: [
      { title: "Study in NL Official Portal", url: "https://www.studyinnl.org", organization: "Nuffic Dutch Organization for Internationalization" },
      { title: "Studielink National Portal", url: "https://www.studielink.nl", organization: "Dutch Ministry of Education" },
    ],
  },
  {
    id: "poland",
    slug: "poland",
    name: "Poland",
    shortName: "Poland",
    flag: "🇵🇱",
    tagline: "Quality European Education, Affordable Tuition & Welcoming Student Life",
    popularFor: "Quality education, low tuition fees and a welcoming student community.",
    heroImage: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=1200&auto=format&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop",
    accentColor: "from-rose-600 to-red-700",
    stats: {
      avgTuition: "€2,000 – €4,500 / yr",
      livingCost: "€450 – €750 / mo",
      postStudyWork: "9 Months Graduate Visa",
      intakeMonths: "Oct & Feb",
    },
    overview:
      "Poland has become one of Central Europe's most attractive study destinations. Offering globally accredited medical, engineering, and business programs at a fraction of Western European tuition and living costs.",
    highlights: [
      "Extremely affordable living costs (€450–€750/month) with high standard of safety",
      "Over 800 English-taught accredited Bachelor's and Master's degrees",
      "Centuries of academic excellence: Jagiellonian University (1364) & University of Warsaw",
      "Schengen Area membership allowing free travel across 29 European countries",
    ],
    studyOpportunities: [
      {
        level: "Bachelor's Degrees",
        description: "3-year BA/BSc or 3.5-year Engineering degrees taught fully in English.",
        topFields: ["General Medicine (MD)", "Computer Science", "International Management", "Civil Engineering"],
      },
      {
        level: "Master's Degrees",
        description: "1.5 to 2-year programs with focus on practical European employment preparation.",
        topFields: ["Data Analytics", "Biotechnology", "European Studies", "Finance & Accounting"],
      },
    ],
    entryRequirements: {
      academic: "Secondary school certificate (Baccalaureate) or Bachelor's degree with apostille/legalization.",
      englishRequirements: {
        exam: "IELTS Academic, TOEFL, or recognized B2 certificate",
        undergraduate: "6.0 Overall",
        postgraduate: "6.5 Overall",
        notes: "Some universities offer internal English language interviews or tests.",
      },
      documentsRequired: [
        "Legalized/Apostilled diplomas and academic transcripts",
        "Official IELTS Academic score report (B2 minimum)",
        "Medical certificate of fitness for study",
        "Passport copy and biometric photographs",
        "Letter of eligibility (confirming degree qualifies for higher education)",
      ],
    },
    estimatedCosts: {
      academicYear: "2026/2027",
      tuitionRange: "€2,000 – €4,500 / year (Medical programs €10,000–€14,000)",
      livingExpenses: "€450 – €750 / month (dormitories/flats, groceries, transit)",
      healthInsurance: "€15 – €30 / month (NFZ National Health Fund)",
      disclaimer: "Living expenses in Warsaw and Krakow are slightly higher than in Wroclaw, Poznan, or Gdansk.",
    },
    applicationProcess: [
      { step: 1, title: "Choose Program & University", description: "Select your desired English-taught course via NAWA or university recruitment portals." },
      { step: 2, title: "Online Registration & Document Upload", description: "Create account on university recruitment system (IRK/ESK) and upload verified documents." },
      { step: 3, title: "Tuition Payment & Acceptance Letter", description: "Pay first semester/year tuition to receive the official Letter of Acceptance." },
      { step: 4, title: "Polish National Student Visa (Type D)", description: "Apply at the Polish Embassy or VFS Global center with proof of funds and admission letter." },
    ],
    popularUniversities: [
      { name: "University of Warsaw", city: "Warsaw", type: "Poland's Top-Ranked Comprehensive University" },
      { name: "Jagiellonian University", city: "Krakow", type: "Founded in 1364, historic excellence" },
      { name: "Warsaw University of Technology", city: "Warsaw", type: "Premier Polytechnic and IT Institute" },
      { name: "Wroclaw University of Science and Technology", city: "Wroclaw", type: "Leading Central European Engineering Hub" },
    ],
    officialResources: [
      { title: "Ready, Study, GO! Poland", url: "https://study.gov.pl", organization: "Polish National Agency for Academic Exchange (NAWA)" },
      { title: "Ministry of Science and Higher Education", url: "https://www.gov.pl/web/nauka", organization: "Republic of Poland" },
    ],
  },
];

export function getAllDestinations(): Destination[] {
  return DESTINATIONS;
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
