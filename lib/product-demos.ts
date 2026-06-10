export type ResumeData = {
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  education: {
    school: string;
    degree: string;
    dates: string;
    detail?: string;
  }[];
  experience: {
    role: string;
    org: string;
    location: string;
    dates: string;
    bullets: string[];
  }[];
  recognition: string[];
  ukContribution?: string;
  skills?: string[];
};

export type ScanProfile = {
  name: string;
  role: string;
  company: string;
  score: number;
  route: string;
  techNationFit: string;
  resume: ResumeData;
  strengths: { criterion: string; detail: string }[];
  weaknesses: { criterion: string; detail: string }[];
  nextSteps: { action: string; priority: "high" | "medium" }[];
};

export const SCAN_PROFILES: ScanProfile[] = [
  {
    name: "Alex Morgan",
    role: "Staff Engineer",
    company: "Stripe",
    score: 88,
    route: "Global Talent",
    techNationFit: "Exceptional Talent — Digital Technology",
    resume: {
      contact: {
        email: "alex.morgan@email.com",
        phone: "+44 7700 900 123",
        location: "London, UK (relocating Q3 2025)",
        linkedin: "linkedin.com/in/alexmorgan",
      },
      summary:
        "Staff engineer with 7+ years building payments infrastructure at Stripe, Monzo, and Goldman Sachs. Demonstrable innovation (patent-pending fraud detection), independent recognition (IEEE S&P speaker, ACM Queue author), and commercial impact ($12B+ ledger volume). Seeking UK Global Talent endorsement in Digital Technology.",
      education: [
        {
          school: "Imperial College London",
          degree: "MEng, Computing (Software Engineering)",
          dates: "2013 — 2017",
          detail: "First Class Honours. Dissertation: distributed ledger consensus algorithms.",
        },
      ],
      ukContribution:
        "Relocating Q3 2025 to advance UK fintech infrastructure. Advising TreasuryOS and PayFlow on payments architecture. Committed to open-source treasury tooling for UK SMEs and mentoring via Founder Institute London.",
      experience: [
        {
          role: "Staff Engineer",
          org: "Stripe",
          location: "San Francisco (remote)",
          dates: "Jan 2020 — Present",
          bullets: [
            "Lead 12-person payments platform team architecting real-time event-sourcing ledger processing $12B+ annual volume",
            "Reduced payment latency 40% and chargebacks 22%, saving $4.2M annually across EU merchant base",
            "Patent pending: real-time fraud detection graph (USPTO filed 2024); mentored 6 engineers to senior level",
          ],
        },
        {
          role: "Senior Software Engineer",
          org: "Monzo Bank",
          location: "London, UK",
          dates: "Aug 2017 — Dec 2019",
          bullets: [
            "Built core banking APIs serving 4M UK customers at 99.99% uptime during peak regulatory migration",
            "Open-sourced ledger-kit — 4,200 GitHub stars; promoted to Senior within 18 months",
          ],
        },
        {
          role: "Software Engineer",
          org: "Goldman Sachs",
          location: "London, UK",
          dates: "Jul 2015 — Jul 2017",
          bullets: [
            "Developed low-latency trading infrastructure processing 2M+ transactions daily",
            "Graduate programme top quartile; cross-desk platform engineering rotation",
          ],
        },
      ],
      recognition: [
        "IEEE Symposium on Security & Privacy 2023 — invited speaker on payment infrastructure",
        "ACM Queue published article: 'Designing Real-Time Ledgers at Scale' (2023)",
        "London FinTech Week 2024 — panel speaker on UK payments regulation",
        "Patent pending — real-time fraud graph (USPTO application #2024-XXXX)",
      ],
      skills: [
        "Java",
        "Scala",
        "Distributed Systems",
        "Payments",
        "Kubernetes",
        "Event Sourcing",
      ],
    },
    strengths: [
      {
        criterion: "Innovation",
        detail: "Patent-pending fraud graph + open-source SDK with 4.2k GitHub stars",
      },
      {
        criterion: "Recognition",
        detail: "IEEE S&P speaker + ACM Queue publication — independent of employer",
      },
      {
        criterion: "Commercial impact",
        detail: "$12B+ ledger volume with quantified fraud reduction metrics",
      },
      {
        criterion: "UK contribution",
        detail: "London FinTech Week speaker; advising 2 UK startups documented",
      },
    ],
    weaknesses: [
      {
        criterion: "Referee letters",
        detail: "1 of 3 referee drafts complete — final alignment review needed",
      },
    ],
    nextSteps: [
      { action: "Finalise remaining 2 referee letters with endorser talking points", priority: "medium" },
      { action: "Submit pre-filing readiness review with Markapture", priority: "medium" },
    ],
  },
  {
    name: "Priya Sharma",
    role: "Senior ML Engineer",
    company: "DeepMind",
    score: 84,
    route: "Global Talent",
    techNationFit: "Exceptional Talent — Digital Technology",
    resume: {
      contact: {
        email: "priya.sharma@email.com",
        phone: "+44 7700 123 456",
        location: "London, UK (relocating from Bangalore)",
        linkedin: "linkedin.com/in/priyasharma-ml",
      },
      summary:
        "Senior machine learning engineer with 6+ years building production recommender and ranking systems at global scale. Lead engineer on models serving 40M+ users with measurable engagement uplift. NeurIPS workshop co-author and Kaggle Grandmaster. Seeking UK Global Talent endorsement to contribute to London's AI research ecosystem.",
      education: [
        {
          school: "Indian Institute of Technology Delhi",
          degree: "B.Tech, Computer Science & Engineering",
          dates: "2014 — 2018",
          detail: "First Class Honours · Dean's List · Thesis: large-scale collaborative filtering",
        },
        {
          school: "University College London",
          degree: "MSc, Machine Learning (part-time, in progress)",
          dates: "2024 — Present",
        },
      ],
      ukContribution:
        "Relocating to join London's AI ecosystem. MSc at UCL in progress. Plans to open-source ranking evaluation tooling for UK startups and mentor ML engineers via Ada Lovelace Institute network.",
      experience: [
        {
          role: "Senior ML Engineer",
          org: "DeepMind",
          location: "London, UK",
          dates: "Jan 2022 — Present",
          bullets: [
            "Lead engineer on ranking model rewrite — +18% engagement across 3 products, 40M+ users",
            "Designed real-time inference pipeline reducing p99 latency from 120ms to 38ms",
            "Mentored 4 engineers to promotion; ML review standards adopted by 2 teams",
          ],
        },
        {
          role: "ML Engineer II",
          org: "Spotify",
          location: "Stockholm, Sweden",
          dates: "Jun 2018 — Dec 2021",
          bullets: [
            "Built personalised discovery models for 180M+ MAU with multi-armed bandit optimisation layer",
            "Co-authored internal research paper cited by 3 product teams; +12% session duration via A/B features",
          ],
        },
        {
          role: "Research Intern",
          org: "Microsoft Research",
          location: "Bangalore, India",
          dates: "May 2017 — Aug 2017",
          bullets: [
            "Contributed to large-scale recommender systems research referenced in NeurIPS 2022 workshop paper",
          ],
        },
      ],
      recognition: [
        "NeurIPS 2022 Workshop — co-author, 'Efficient Ranking at Scale'",
        "Google ML Tech Talk Series — invited speaker, 2023",
        "Kaggle Grandmaster — top 0.1% globally",
        "2 patents filed — recommendation system architectures (2021)",
      ],
      skills: [
        "Python",
        "TensorFlow",
        "PyTorch",
        "Distributed Systems",
        "MLOps",
        "Kubernetes",
      ],
    },
    strengths: [
      {
        criterion: "Innovation",
        detail: "Novel ranking architecture with measurable product impact at 40M+ user scale",
      },
      {
        criterion: "Technical contribution",
        detail: "Production ML systems with quantified latency and engagement gains",
      },
      {
        criterion: "Recognition",
        detail: "NeurIPS workshop paper + invited Google tech talk — independent of employer",
      },
    ],
    weaknesses: [
      {
        criterion: "Referee alignment",
        detail: "Need 1 additional independent industry referee briefed on criteria",
      },
      {
        criterion: "UK contribution",
        detail: "UK plan present on CV — personal statement should expand sector specifics",
      },
    ],
    nextSteps: [
      { action: "Secure independent industry referee (non-employer)", priority: "high" },
      { action: "Expand UK contribution section in personal statement", priority: "medium" },
    ],
  },
  {
    name: "Amira Hassan",
    role: "Principal Software Engineer",
    company: "Cloudflare",
    score: 86,
    route: "Global Talent",
    techNationFit: "Exceptional Talent — Digital Technology",
    resume: {
      contact: {
        email: "amira.hassan@email.com",
        phone: "+44 7700 456 789",
        location: "Manchester, UK",
        linkedin: "linkedin.com/in/amirahassan",
      },
      summary:
        "Principal software engineer with 10+ years building globally distributed edge infrastructure. Architect of Cloudflare's serverless compute platform serving 2.5M+ developers. Published author, conference keynote speaker, and open-source maintainer with 8,000+ GitHub stars across projects. UK-based leader in digital infrastructure.",
      education: [
        {
          school: "University of Manchester",
          degree: "MSc, Advanced Computer Science",
          dates: "2012 — 2013",
          detail: "Distinction · Dissertation: distributed consensus at the edge",
        },
        {
          school: "Cairo University",
          degree: "BSc, Computer Engineering",
          dates: "2008 — 2012",
          detail: "First Class Honours · Valedictorian",
        },
      ],
      ukContribution:
        "Based in Manchester advancing UK edge computing capability. Leads Cloudflare's UK engineering hub (45 engineers). Advises Tech Nation alumni network and mentors women in STEM via Code First Girls.",
      experience: [
        {
          role: "Principal Software Engineer",
          org: "Cloudflare",
          location: "Manchester, UK",
          dates: "Mar 2019 — Present",
          bullets: [
            "Architected Workers platform — 2.5M+ developers, 50B+ requests/day across 300+ edge locations",
            "Led UK engineering hub growth from 8 to 45 engineers; established Manchester R&D centre",
            "Reduced cold-start latency 62% via novel V8 isolate pooling — adopted company-wide",
          ],
        },
        {
          role: "Staff Software Engineer",
          org: "Amazon Web Services",
          location: "London, UK",
          dates: "Jun 2015 — Feb 2019",
          bullets: [
            "Built Lambda runtime infrastructure serving millions of concurrent executions globally",
            "Led 10-person team shipping VPC networking features for 500k+ enterprise customers",
          ],
        },
        {
          role: "Software Engineer",
          org: "Bloomberg",
          location: "London, UK",
          dates: "Sep 2013 — May 2015",
          bullets: [
            "Developed low-latency market data distribution systems for institutional clients",
            "Promoted within 18 months; selected for graduate leadership programme",
          ],
        },
      ],
      recognition: [
        "QCon London 2024 — keynote speaker on edge compute architecture (1,800 attendees)",
        "O'Reilly published author: 'Edge Computing Patterns' (2023)",
        "GitHub — 8,200+ stars across open-source edge-runtime projects",
        "Women in Tech UK — Rising Star Award 2022",
      ],
      skills: [
        "Rust",
        "Go",
        "Distributed Systems",
        "Edge Computing",
        "WebAssembly",
        "Platform Architecture",
      ],
    },
    strengths: [
      {
        criterion: "Innovation",
        detail: "Novel V8 isolate pooling adopted company-wide; edge platform at 50B+ requests/day",
      },
      {
        criterion: "Recognition",
        detail: "QCon keynote + O'Reilly publication — independent of day-to-day role",
      },
      {
        criterion: "UK leadership",
        detail: "Built Manchester R&D hub; direct UK digital economy contribution documented",
      },
    ],
    weaknesses: [
      {
        criterion: "Evidence inventory",
        detail: "2 supporting documents not yet cross-referenced in evidence pack",
      },
    ],
    nextSteps: [
      { action: "Catalogue remaining evidence items in endorser inventory", priority: "medium" },
      { action: "Schedule pre-filing CV audit with Markapture", priority: "medium" },
    ],
  },
];

/** Streamlined intake — contact, career background, then endorser evidence */
export const CV_FORM_FIELDS = [
  { label: "Full name", key: "name", group: "contact" },
  { label: "Email", key: "email", group: "contact" },
  { label: "Phone", key: "phone", group: "contact" },
  { label: "Current location", key: "location", group: "contact" },
  { label: "Education", key: "education", group: "background" },
  { label: "Professional experience", key: "experience", group: "background" },
  { label: "Recognition beyond occupation", key: "recognition", group: "background" },
  { label: "Innovation & technical contribution", key: "innovation", group: "evidence" },
  { label: "Leadership & commercial impact", key: "leadership", group: "evidence" },
  { label: "UK contribution plan", key: "uk", group: "evidence" },
] as const;

/** Wizard sections — one screen at a time, Next between each */
export const CV_FORM_SECTIONS = [
  {
    id: "contact" as const,
    title: "Contact details",
    description: "Header information for your CV",
    fieldKeys: ["name", "email", "phone", "location"] as const,
  },
  {
    id: "background" as const,
    title: "Career background",
    description: "Education, roles, and recognition",
    fieldKeys: ["education", "experience", "recognition"] as const,
  },
  {
    id: "evidence" as const,
    title: "Global Talent evidence",
    description: "Innovation, leadership, and UK contribution",
    fieldKeys: ["innovation", "leadership", "uk"] as const,
  },
] as const;

export const CV_FORM_VALUES: Record<(typeof CV_FORM_FIELDS)[number]["key"], string> = {
  name: "Alex Morgan",
  email: "alex.morgan@email.com",
  phone: "+44 7700 900 123",
  location: "London, UK (relocating Q3 2025)",
  education:
    "MEng Computing (Software Engineering), Imperial College London — First Class Honours, 2017. Dissertation on distributed ledger consensus.",
  experience:
    "Staff Engineer, Stripe (2020–present): lead 12-person payments platform, $12B+ ledger volume. Senior Engineer, Monzo Bank (2017–2019): core banking APIs, 4M UK customers. Software Engineer, Goldman Sachs (2015–2017): low-latency trading infrastructure.",
  recognition:
    "IEEE Symposium on Security & Privacy 2023 — invited speaker. ACM Queue article (2023). London FinTech Week 2024 panelist. Patent pending — real-time fraud graph (USPTO 2024).",
  innovation:
    "Patent pending: real-time fraud detection graph. Event-sourcing ledger adopted company-wide. Open-source ledger-kit — 4,200 GitHub stars.",
  leadership:
    "Led 12-person platform team across 3 time zones. Mentored 6 engineers to senior level. Top 5% performer 2022–2024.",
  uk: "Advising TreasuryOS & PayFlow on UK payments architecture. Open-source treasury tooling for UK SMEs. Founder Institute London mentor.",
};

export type PackDocument = {
  title: string;
  status: "complete" | "partial" | "missing";
  detail: string;
  score?: number;
};

export const WITHOUT_PACK: PackDocument[] = [
  { title: "CV", status: "partial", detail: "Generic format — not mapped to Tech Nation criteria" },
  { title: "Personal statement", status: "missing", detail: "Not started — no criteria alignment" },
  { title: "Referee letters (×3)", status: "missing", detail: "Referees not briefed on endorser rubric" },
  { title: "Evidence inventory", status: "partial", detail: "Documents scattered — gaps unknown" },
];

export const WITH_PACK: PackDocument[] = [
  { title: "CV — Tech Nation rubric", status: "complete", detail: "All 4 mandatory criteria addressed", score: 94 },
  { title: "Personal statement", status: "complete", detail: "Mapped to innovation, recognition, contribution, UK plan" },
  { title: "Referee pack (×3)", status: "complete", detail: "Briefed with endorser talking points & evidence links" },
  { title: "Evidence inventory", status: "complete", detail: "12 items catalogued with priority gaps flagged", score: 91 },
];

export type InnovatorSection = {
  title: string;
  score: number;
  status: "pass" | "warn" | "scan";
  note: string;
  detail: string;
  evidence: string[];
  scanCheck: string;
};

export const INNOVATOR_SCENARIOS = [
  {
    venture: "NovaPay — embedded B2B payments",
    readiness: 82,
    sections: [
      {
        title: "Innovation thesis",
        score: 88,
        status: "pass" as const,
        note: "Novel API-first treasury model",
        detail: "Patent-pending routing engine; 3 UK pilot merchants with signed LOIs",
        evidence: ["API specification", "Pilot LOIs ×3", "Tech appendix"],
        scanCheck: "Benchmarking novelty against existing UK treasury APIs",
      },
      {
        title: "UK market entry",
        score: 76,
        status: "warn" as const,
        note: "Pilot data strong; TAM needs cite",
        detail: "£2.1M ARR pipeline from 14 UK SMEs — total addressable market uncited",
        evidence: ["Pilot revenue data", "Customer interviews", "Competitor map"],
        scanCheck: "Validating UK traction claims and market sizing sources",
      },
      {
        title: "Scalability",
        score: 91,
        status: "pass" as const,
        note: "Multi-tenant architecture verified",
        detail: "Handles 50k+ concurrent API calls; auto-scaling on AWS with 99.9% uptime SLA",
        evidence: ["Architecture diagram", "Load-test report", "Infra cost model"],
        scanCheck: "Stress-testing infrastructure claims against endorser thresholds",
      },
      {
        title: "Financial viability",
        score: 69,
        status: "warn" as const,
        note: "Year-3 projections need detail",
        detail: "18-month runway at current burn; year-3 revenue assumptions lack sensitivity analysis",
        evidence: ["P&L forecast", "Cash-flow model", "Funding round deck"],
        scanCheck: "Auditing 3-year projections and runway assumptions",
      },
    ],
    endorserVerdict:
      "Strong innovation case with credible UK pilots. Resolve TAM citation and year-3 financial detail before filing.",
  },
  {
    venture: "HelixBio — AI drug discovery platform",
    readiness: 74,
    sections: [
      {
        title: "Innovation thesis",
        score: 92,
        status: "pass" as const,
        note: "Proprietary molecular graph model",
        detail: "Novel GNN architecture achieving 34% faster candidate screening vs baselines",
        evidence: ["Published preprint", "Model benchmarks", "IP filing receipt"],
        scanCheck: "Reviewing proprietary model against published state of the art",
      },
      {
        title: "UK market entry",
        score: 58,
        status: "warn" as const,
        note: "NHS partnership letter missing",
        detail: "2 UK biotech advisors engaged; formal NHS collaboration letter not yet attached",
        evidence: ["Advisor bios", "UK clinic outreach", "Market sizing draft"],
        scanCheck: "Checking UK market traction and partnership documentation",
      },
      {
        title: "Scalability",
        score: 85,
        status: "pass" as const,
        note: "Cloud pipeline cost model solid",
        detail: "GPU cluster scales to 200+ concurrent experiments; unit economics documented per assay",
        evidence: ["Pipeline architecture", "Cost-per-assay model", "AWS usage report"],
        scanCheck: "Validating cloud pipeline scalability and unit economics",
      },
      {
        title: "Financial viability",
        score: 62,
        status: "warn" as const,
        note: "Burn rate vs runway unclear",
        detail: "£1.8M seed secured; monthly burn inconsistent across plan sections ( £95k–£120k )",
        evidence: ["Cap table", "Burn breakdown", "Investor term sheet"],
        scanCheck: "Cross-referencing burn rate, runway, and revenue milestones",
      },
    ],
    endorserVerdict:
      "High innovation score with solid technical evidence. UK traction and financial consistency are the blockers.",
  },
];
