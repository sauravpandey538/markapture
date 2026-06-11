import { z } from "zod";

/** Global Talent endorsement sub-routes */
export const GT_ROUTES = [
  {
    id: "digital-technology",
    label: "Digital Technology",
    endorser: "Tech Nation",
    description:
      "Software engineering, AI/ML, cybersecurity, fintech, and product leadership in digital sectors.",
  },
  {
    id: "science-research",
    label: "Science & Research",
    endorser: "UKRI / Royal Society",
    description:
      "STEM researchers with publications, grants, and demonstrable field-leading contributions.",
  },
  {
    id: "arts-culture",
    label: "Arts & Culture",
    endorser: "Arts Council England",
    description:
      "Exceptional talent in arts, design, fashion, architecture, and cultural production.",
  },
  {
    id: "academia",
    label: "Academia & Research",
    endorser: "British Academy / Royal Academy",
    description:
      "Academic researchers and professors with international recognition in humanities and social sciences.",
  },
] as const;

export type GtRouteId = (typeof GT_ROUTES)[number]["id"];

export const TECH_NATION_CRITERIA = [
  "Innovation in digital technology",
  "Recognition beyond occupation",
  "Significant technical contribution",
  "UK contribution plan",
] as const;

/** Categories for LLM-generated endorsement intake questions */
export const GT_QUESTION_CATEGORIES = {
  endorsement: "Endorsement positioning",
  uk_plan: "UK contribution plan",
  referees: "Referees & experts",
  evidence: "Evidence & portfolio",
  timeline: "Application timeline",
  intent: "Intent & circumstances",
  contact: "Contact",
} as const;

export type GtQuestionCategory = keyof typeof GT_QUESTION_CATEGORIES;

/** LLM-generated question — only asks what the CV does not cover */
export const dynamicQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["text", "textarea", "select"]),
  category: z
    .enum([
      "endorsement",
      "uk_plan",
      "referees",
      "evidence",
      "timeline",
      "intent",
      "contact",
    ])
    .optional(),
  placeholder: z.string().optional(),
  hint: z.string().optional(),
  options: z.array(z.string()).optional(),
});

export const generatedQuestionsSchema = z.object({
  // LLM may over-generate — cap at 8 before validating
  questions: z
    .array(dynamicQuestionSchema)
    .transform((questions) => questions.slice(0, 8))
    .pipe(z.array(dynamicQuestionSchema).min(4).max(8)),
  resumeSummary: z.string(),
});

export type DynamicQuestion = z.infer<typeof dynamicQuestionSchema>;
export type GeneratedQuestions = z.infer<typeof generatedQuestionsSchema>;

/** Legacy static fields — kept for reference, no longer used in wizard */
export const ASSESSMENT_FIELDS = [
  { key: "name", label: "Full name", group: "contact", type: "text" as const },
  { key: "email", label: "Email", group: "contact", type: "email" as const },
  { key: "location", label: "Current location", group: "contact", type: "text" as const },
  {
    key: "yearsExperience",
    label: "Years of professional experience",
    group: "contact",
    type: "text" as const,
  },
  {
    key: "education",
    label: "Education & qualifications",
    group: "background",
    type: "textarea" as const,
    placeholder: "Degrees, institutions, honours, relevant certifications…",
  },
  {
    key: "experience",
    label: "Professional experience",
    group: "background",
    type: "textarea" as const,
    placeholder: "Key roles, companies, impact metrics, leadership scope…",
  },
  {
    key: "recognition",
    label: "Recognition beyond your occupation",
    group: "background",
    type: "textarea" as const,
    placeholder: "Awards, speaking engagements, publications, media, patents…",
  },
  {
    key: "innovation",
    label: "Innovation & technical contribution",
    group: "evidence",
    type: "textarea" as const,
    placeholder: "Products built, open source, patents, novel methods, commercial impact…",
  },
  {
    key: "leadership",
    label: "Leadership & commercial impact",
    group: "evidence",
    type: "textarea" as const,
    placeholder: "Teams led, revenue/cost impact, mentoring, board/advisory roles…",
  },
  {
    key: "ukPlan",
    label: "UK contribution plan",
    group: "evidence",
    type: "textarea" as const,
    placeholder: "How you will contribute to the UK sector — roles, ventures, mentoring, research…",
  },
  {
    key: "timeline",
    label: "When do you plan to apply?",
    group: "evidence",
    type: "select" as const,
    options: [
      "Within 1 month",
      "1–3 months",
      "3–6 months",
      "6–12 months",
      "Exploring — no fixed date",
    ],
  },
  {
    key: "referees",
    label: "Referees identified?",
    group: "evidence",
    type: "select" as const,
    options: [
      "Yes — 3 senior referees ready",
      "Partial — 1–2 identified",
      "Not yet — need guidance",
    ],
  },
] as const;

export type AssessmentFieldKey = (typeof ASSESSMENT_FIELDS)[number]["key"];

export const ASSESSMENT_SECTIONS = [
  {
    id: "contact" as const,
    title: "About you",
    description: "Basic details so we can personalise your assessment",
    fieldKeys: ["name", "email", "location", "yearsExperience"] as const,
  },
  {
    id: "background" as const,
    title: "Career background",
    description: "Education, roles, and external recognition",
    fieldKeys: ["education", "experience", "recognition"] as const,
  },
  {
    id: "evidence" as const,
    title: "Global Talent evidence",
    description: "Innovation, leadership, UK plans, and filing readiness",
    fieldKeys: [
      "innovation",
      "leadership",
      "ukPlan",
      "timeline",
      "referees",
    ] as const,
  },
] as const;

export const assessmentRequestSchema = z.object({
  routeId: z.enum([
    "digital-technology",
    "science-research",
    "arts-culture",
    "academia",
  ]),
  answers: z.record(z.string(), z.string().min(1)),
  questions: z.array(dynamicQuestionSchema).optional(),
});

export const assessmentResultSchema = z.object({
  score: z.number().min(0).max(100),
  route: z.string(),
  techNationFit: z.string(),
  summary: z.string(),
  strengths: z.array(
    z.object({
      criterion: z.string(),
      detail: z.string(),
    })
  ),
  gaps: z.array(
    z.object({
      criterion: z.string(),
      detail: z.string(),
    })
  ),
  nextSteps: z.array(
    z.object({
      action: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      timeline: z.string(),
    })
  ),
  preparationTimeline: z.array(
    z.object({
      phase: z.string(),
      duration: z.string(),
      focus: z.string(),
    })
  ),
});

export type AssessmentResult = z.infer<typeof assessmentResultSchema>;

export function isGtRouteId(id: string | null | undefined): id is GtRouteId {
  return GT_ROUTES.some((r) => r.id === id);
}

export function getRouteById(id: GtRouteId) {
  return GT_ROUTES.find((r) => r.id === id)!;
}
