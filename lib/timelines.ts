export type TimelineStep = {
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
};

export const GLOBAL_TALENT_TIMELINE: TimelineStep[] = [
  {
    title: "Discovery & route confirmation",
    duration: "Week 1",
    description:
      "We map your career against Tech Nation / endorser criteria and confirm Global Talent is the right route — or flag if Innovator Founder fits better.",
    deliverables: [
      "Eligibility scorecard for both routes",
      "Evidence inventory workshop",
      "Personalised preparation roadmap",
    ],
  },
  {
    title: "Evidence mapping & gap analysis",
    duration: "Weeks 2–3",
    description:
      "Every claim in your application is tied to proof. We identify weak spots in publications, impact metrics, referees, and industry recognition before endorsers do.",
    deliverables: [
      "Prioritised evidence checklist",
      "Gap remediation plan",
      "Referee shortlist & briefing notes",
    ],
  },
  {
    title: "CV & narrative refinement",
    duration: "Weeks 3–4",
    description:
      "Your CV and personal statement are rewritten around exceptional talent markers — leadership, impact, and field-specific signals endorsers scan for.",
    deliverables: [
      "Scored CV review with line-by-line feedback",
      "Personal statement structure & draft review",
      "Portfolio / GitHub alignment (if applicable)",
    ],
  },
  {
    title: "Pre-submission review",
    duration: "Week 5+",
    description:
      "A final pass across all documents simulating endorser scrutiny. You submit knowing what questions have already been answered.",
    deliverables: [
      "Document pack review session",
      "Submission readiness checklist",
      "Post-submission guidance outline",
    ],
  },
];

export const INNOVATOR_FOUNDER_TIMELINE: TimelineStep[] = [
  {
    title: "Route & founder fit assessment",
    duration: "Week 1",
    description:
      "We evaluate whether your profile suits Innovator Founder — innovation credibility, scalability, and founder commitment — compared to Global Talent.",
    deliverables: [
      "Route comparison report",
      "Innovation thesis draft review",
      "Founder narrative assessment",
    ],
  },
  {
    title: "Business plan stress-test",
    duration: "Weeks 2–3",
    description:
      "Endorsers scrutinise market size, competition, financials, and UK traction. We pressure-test your plan against real rubrics — not generic templates.",
    deliverables: [
      "Business plan section-by-section feedback",
      "UK market entry narrative",
      "Competitive differentiation map",
    ],
  },
  {
    title: "Founder CV & pitch alignment",
    duration: "Weeks 3–4",
    description:
      "Your founder CV, LinkedIn, and pitch deck must tell one coherent story. We align all three so endorsers see a credible, investable founder.",
    deliverables: [
      "Founder CV scored review",
      "Deck narrative restructuring",
      "LinkedIn profile alignment",
    ],
  },
  {
    title: "Endorsement filing prep",
    duration: "Week 5+",
    description:
      "Final review of your innovation claims, financial projections, and supporting evidence. Walk into the endorser application with defensible documentation.",
    deliverables: [
      "Pre-filing document audit",
      "Innovation evidence pack",
      "Mock endorser Q&A session",
    ],
  },
];

export const CONSULTATION_SESSION_TIMELINE = [
  {
    phase: "Before the call",
    duration: "24h prior",
    items: [
      "Calendar invite with Google Meet link",
      "Short prep form — route preference & background",
      "Reminder to upload CV in advance",
    ],
  },
  {
    phase: "During the call",
    duration: "30 minutes",
    items: [
      "Your background & UK goals (5 min)",
      "Route assessment — Global Talent vs Innovator Founder (10 min)",
      "Evidence strengths & gaps discussion (10 min)",
      "Q&A and next steps (5 min)",
    ],
  },
  {
    phase: "After the call",
    duration: "Within 48h",
    items: [
      "Written summary of recommended route",
      "High-level preparation timeline",
      "Optional follow-up booking link",
    ],
  },
] as const;
