import { z } from "zod";
import { getLabelAndDescriptionFromTemplate } from "@/lib/tech-nation-templates";

/** Single evidence option within a Tech Nation criterion section */
export type EvidenceOption = {
  id: string;
  template: string;
  label: string;
  explanation: string;
};

/** Tech Nation endorsement criterion section (MC, OC1–OC4) */
export type TechNationCriterion = {
  id: string;
  title: string;
  question: string;
  explanation: string;
  minSelect: number;
  maxSelect: number;
  idealSelect: number;
  options: EvidenceOption[];
};

function opt(id: string, template: string): EvidenceOption {
  const { label, description } = getLabelAndDescriptionFromTemplate(template);
  return { id, template, label, explanation: description };
}

/** Official Tech Nation Digital Technology criteria structure */
export const TECH_NATION_CRITERIA_DATA: TechNationCriterion[] = [
  {
    id: "ps",
    title: "Personal Statement",
    question:
      "Does your personal statement clearly position you as Exceptional Talent or Exceptional Promise and tie your career to Tech Nation mandatory criteria?",
    explanation: `Tech Nation requires a personal statement as part of the Stage 1 endorsement application. It should:

- Clearly state whether you are applying as Exceptional Talent (typically 5+ years, sustained track record) or Exceptional Promise (typically ≤5 years, emerging recognition)
- Present a coherent career narrative — not a CV reprint
- Include a specific UK contribution plan: named sectors, employers, ventures, communities, or timelines
- Thread evidence themes that align with Mandatory Criteria (recognition as leading talent in digital technology in the last 5 years)
- Use quantified impact where possible — metrics, scale, outcomes
- Avoid generic relocation motivation, buzzwords without proof, or copy-paste templates
- Typically 1,000–1,500 words; clear structure with endorser-scannable sections

The personal statement does NOT replace evidence documents — it frames them. Assessors read it alongside MC/OC evidence and three letters of reference.`,
    minSelect: 1,
    maxSelect: 1,
    idealSelect: 1,
    options: [opt("ps", "ps")],
  },
  {
    id: "lor",
    title: "Letters of Reference (LoR)",
    question:
      "Does this letter of reference meet Tech Nation requirements for senior, independent endorsement with specific criterion-aligned examples?",
    explanation: `Tech Nation requires exactly 3 letters of reference for Stage 1 endorsement. Each letter should:

- Be from a senior expert in digital technology who knows your work well (typically 2+ years)
- Include the referee's credentials, relationship to you, and how long they have known you
- Contain SPECIFIC examples — projects, innovations, impact metrics, recognition — not generic praise
- Ideally include at least one referee who is NOT your direct line manager or employer
- Address how you meet endorsement criteria (leading talent / promise in digital technology)
- Be on letterhead, dated, signed, and professionally written
- NOT be the sole evidence for any criterion — letters support the evidence pack

Weak letters: "Saurav is a great team player", LinkedIn-style endorsements, letters written by HR, vague superlatives without examples, letters that only repeat CV bullet points.

Review ONE letter at a time. Note which of the 3 slots this appears to be (1st, 2nd, or 3rd) based on content if stated.`,
    minSelect: 1,
    maxSelect: 3,
    idealSelect: 3,
    options: [opt("lor1", "lor1"), opt("lor2", "lor2"), opt("lor3", "lor3")],
  },
  {
    id: "mandatory",
    title: "Mandatory Criteria (MC)",
    question:
      "How do you demonstrate that you have been recognised as (or recognised as having the potential to be) a leading talent in the digital technology sector in the last 5 years?",
    explanation: `A 'leader' of exceptional talent (or promise) must show extraordinary ability by sustained (or emerging) national or international recognition. The individual will be able to demonstrate a level of expertise (or emerging expertise) which places them at the forefront of their respective field in the digital technology sector.

All activity you are providing as evidence for the Mandatory Criteria should have occurred within the past 5 years. Note that any evidence which has been made solely to support the timing of your application is unacceptable. Evidence should demonstrate a consistent level of activity over time.

Note that the use of letters of reference alone to show how you meet the criteria is not sufficient, additional evidence should be provided.`,
    minSelect: 3,
    maxSelect: 5,
    idealSelect: 4,
    options: [
      opt("product_led_growth", "product-led-growth"),
      opt(
        "marketing_and_business_development_leadership",
        "marketing-and-business-development-leadership",
      ),
      opt(
        "non_profit_organization_leadership",
        "non-profit-organization-leadership",
      ),
      opt("open_source_contribution", "open-source-contribution"),
      opt("industry_initiative_details", "industry-initiative-details"),
      opt("awards_and_recognition", "awards-and-recognition"),
      opt("speaking_engagements", "speaking-engagements"),
      opt("published_material", "published-material"),
      opt("high_salary_evidence", "high-salary-evidence"),
      opt("expert_panel_participation", "expert-panel-participation"),
    ],
  },
  {
    id: "innovation",
    title: "Optional Criteria 1 (OC1) — Innovation",
    question:
      "How do I demonstrate that I have a proven track record of innovation in the digital technology sector as a founder or senior executive of a product-led digital technology company or an employee working in a new digital field or concept?",
    explanation: `You can demonstrate this by providing evidence of innovation in any genuine and significant product-led digital technology businesses you have established as a founder or senior executive which is currently active or has been dissolved in the last five years. Any company provided as evidence should demonstrate a level of income beyond solely covering the applicant's salary and must have been commercially successful or otherwise demonstrate how the applicant meets the endorsement criteria.

Note 1: The use of letters of reference alone to show how you meet the criteria is not sufficient, additional evidence should be provided.
Note 2: Any evidence (such as papers or patents) which have been made solely to support the timing of your application are unacceptable.
Note 3: Financial information documents alone are insufficient to demonstrate innovation.
Note 4: Evidence such as company accounts should support one innovation — if multiple innovations, list each with relevant documents.`,
    minSelect: 2,
    maxSelect: 4,
    idealSelect: 3,
    options: [
      opt("i1", "innovation-or-product-development"),
      opt("i3", "granted-patent"),
    ],
  },
  {
    id: "voluntary",
    title: "Optional Criteria 2 (OC2) — Voluntary Work",
    question:
      "How do I demonstrate that I have been recognised for my work outside of my immediate occupation that contributed to the advancement of the digital technology sector?",
    explanation: `You can demonstrate this by providing evidence that you have gone beyond your day-to-day profession to engage in a significant activity that contributes to the advancement of the digital technology sector. Any evidence provided should be for voluntary activities (non-paid work) and must not be undertaken whilst representing a company or its products.

Note that mentoring should be primarily in-person activity. Online mentoring platforms alone are not considered sufficient.`,
    minSelect: 2,
    maxSelect: 4,
    idealSelect: 3,
    options: [
      opt("v1", "contribution-open-source"),
      opt("v2", "github-participation"),
      opt("v3", "stack-overflow-participation"),
      opt("v5", "conference-speaking-engagement"),
      opt("v6", "op-ed-or-news-article"),
      opt("v7", "mentorship-evidence"),
    ],
  },
  {
    id: "technical-impact",
    title: "Optional Criteria 3A (OC3A) — Technical Impact",
    question:
      "How do I demonstrate that I have made a significant technical, commercial or entrepreneurial contributions to the field as a founder, senior executive, board member or employee of a product-led digital technology company?",
    explanation: `Tech Nation distinguishes technical applicants from business applicants. Ensure evidence demonstrates your personal work, not that of the company or team.

'Significant contribution' here requires impact, not necessarily innovation — different from OC1. Submitting the same evidence for both may not be sufficient if requirements differ.

Letters of reference alone are not sufficient. Acceptable evidence includes employer letters (additional to endorsement letters), architecture diagrams (max 3 A4 pages showing personal contribution), and GitHub accounts with continuing contribution.`,
    minSelect: 2,
    maxSelect: 3,
    idealSelect: 3,
    options: [
      opt("t1", "high-impact-digital-product"),
      opt("t2", "open-source-advancing-peers"),
      opt("t3", "key-engineer-role"),
    ],
  },
  {
    id: "business-impact",
    title: "Optional Criteria 3B (OC3B) — Business Impact",
    question:
      "How do I demonstrate that I have made a significant technical, commercial or entrepreneurial contributions to the field as a founder, senior executive, board member or employee of a product-led digital technology company?",
    explanation: `Tech Nation distinguishes technical applicants from business applicants. Ensure evidence demonstrates your personal work, not that of the company or team.

'Significant contribution' here requires impact, not necessarily innovation — different from OC1.

Acceptable evidence includes employer letters and documents detailing commercial success (sales pipeline, growth, leads, processes implemented).`,
    minSelect: 2,
    maxSelect: 3,
    idealSelect: 2,
    options: [
      opt("b1", "role-in-leading-digital-product-inv-or-strategy"),
      opt("b2", "role-in-leading-digital-product-delivering-or-releasing"),
      opt("b3", "founded-successful-digital-product-or-service"),
    ],
  },
  {
    id: "academia",
    title: "Optional Criteria 4 (OC4) — Academia",
    question:
      "How do I demonstrate that I have exceptional ability in the field by making academic contributions through research?",
    explanation: `Academic research must be endorsed by a recognised academic expert through peer review in a recognised publication or endorsement from a leading senior academic who supervised you directly.

Letters of reference alone are not sufficient. Awards must be of merit, not solely monetary.`,
    minSelect: 2,
    maxSelect: 4,
    idealSelect: 3,
    options: [
      opt("a1", "paper-published-in-top-tier-peer-reviewed-journal"),
      opt("a2", "peer-reviewed-conference-presentation"),
      opt("a3", "outstanding-applied-work-awarded"),
      opt("a4", "research-supervisor-endorsement"),
      opt("a5", "merit-based-award"),
    ],
  },
];

export type TechNationCriterionId =
  (typeof TECH_NATION_CRITERIA_DATA)[number]["id"];

export function getTechNationCriterion(
  id: string,
): TechNationCriterion | undefined {
  return TECH_NATION_CRITERIA_DATA.find((c) => c.id === id);
}

export function isTechNationCriterionId(
  id: string | null | undefined,
): id is TechNationCriterionId {
  return TECH_NATION_CRITERIA_DATA.some((c) => c.id === id);
}

export function getEvidenceOption(
  criterionId: string,
  optionId: string,
): EvidenceOption | undefined {
  const criterion = getTechNationCriterion(criterionId);
  return criterion?.options.find((o) => o.id === optionId);
}

/** Single-option sections (e.g. Personal Statement) skip the evidence picker step */
export function criterionHasSingleOption(criterionId: string): boolean {
  const criterion = getTechNationCriterion(criterionId);
  return (criterion?.options.length ?? 0) === 1;
}

export const evidenceReviewRequestSchema = z.object({
  criterionId: z.string(),
  evidenceIds: z.array(z.string()).min(1).max(1),
});

export const evidenceReviewResultSchema = z.object({
  criterion: z.string(),
  track: z.string().nullish(),
  score: z.number().min(0).max(100),
  riskBand: z.enum([
    "high_rejection_risk",
    "borderline",
    "strong_readiness",
    "near_ready",
  ]),
  riskSummary: z.string(),
  positioning: z.string(),
  summary: z.string(),
  evidenceAssessments: z.array(
    z.object({
      evidenceType: z.string(),
      fileName: z.string(),
      strength: z.enum(["strong", "partial", "weak", "not_assessable"]),
      detail: z.string(),
      endorserSignal: z.string(),
    }),
  ),
  mandatoryMapping: z.array(
    z.object({
      criterion: z.string(),
      status: z.enum(["met", "partial", "weak", "missing"]),
      detail: z.string(),
    }),
  ),
  gaps: z.array(
    z.object({
      area: z.string(),
      detail: z.string(),
      severity: z.enum(["critical", "major", "minor"]),
    }),
  ),
  recommendations: z.array(
    z.object({
      action: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      timeline: z.string(),
    }),
  ),
});

export type EvidenceReviewResult = z.infer<typeof evidenceReviewResultSchema>;

export type UploadedEvidence = {
  evidenceId: string;
  fileName: string;
  text: string;
  template?: string;
};

export const RISK_BAND_LABELS: Record<
  EvidenceReviewResult["riskBand"],
  {
    label: string;
    description: string;
    tone: "red" | "amber" | "blue" | "green";
  }
> = {
  high_rejection_risk: {
    label: "High rejection risk",
    description: "Multiple critical gaps — unlikely to pass endorsement as-is.",
    tone: "red",
  },
  borderline: {
    label: "Borderline",
    description: "Some evidence present but material gaps remain.",
    tone: "amber",
  },
  strong_readiness: {
    label: "Strong readiness",
    description: "Most signals present — focused refinement needed.",
    tone: "blue",
  },
  near_ready: {
    label: "Near submission-ready",
    description: "Strong across key signals — minor polish only.",
    tone: "green",
  },
};
