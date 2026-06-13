import {
  assessmentResultSchema,
  generatedQuestionsSchema,
  getRouteById,
  TECH_NATION_CRITERIA,
  type AssessmentResult,
  type DynamicQuestion,
  type GeneratedQuestions,
  type GtRouteId,
} from "@/lib/assessment";
import {
  evidenceReviewResultSchema,
  getEvidenceOption,
  getTechNationCriterion,
  type EvidenceReviewResult,
  type UploadedEvidence,
} from "@/lib/evidence-review";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type AnalyzeInput = {
  routeId: GtRouteId;
  answers: Record<string, string>;
  questions?: DynamicQuestion[];
  resumeText?: string;
};

type OpenRouterOptions = {
  deepResearch?: boolean;
  maxTokens?: number;
};

async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  options: OpenRouterOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const base = process.env.OPENROUTER_MODEL ?? "openai/gpt-5.5";
  const useResearch =
    options.deepResearch &&
    process.env.OPENROUTER_DEEP_RESEARCH !== "false";

  const model =
    useResearch && !base.includes(":online") ? `${base}:online` : base;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://markapture.co.uk",
      "X-Title": "Markapture Global Talent Assessment",
    },
    body: JSON.stringify({
      model,
      ...(useResearch ? { plugins: [{ id: "web", max_results: 6 }] } : {}),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: options.maxTokens ?? 20_000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenRouter");
  }

  return content;
}

/** Reads CV and returns personalised questions NOT already answered in the resume */
export async function generateAssessmentQuestions(
  routeId: GtRouteId,
  resumeText: string
): Promise<GeneratedQuestions> {
  const route = getRouteById(routeId);

  const techNationBlock =
    route.id === "digital-technology"
      ? `
Tech Nation mandatory criteria (Stage 1 endorsement):
1. Innovation — leading or founding innovative digital technology ventures/products
2. Recognition — recognition beyond your immediate occupation (speaking, judging, press, awards)
3. Significant technical contribution — work that advances the field
4. UK contribution plan — credible plan to contribute to UK digital economy

Also clarify: Exceptional Talent (5+ years) vs Exceptional Promise (≤5 years) positioning.`
      : `
Map questions to ${route.endorser} endorsement mandatory criteria and evidence expectations for Stage 1 (endorsement letter before visa application).`;

  const systemPrompt = `You are a UK Global Talent Visa (GTV) Stage 1 endorsement intake specialist for the ${route.label} route (${route.endorser}).

Your job: read the CV and generate ONLY follow-up questions for endorsement preparation — information that is MISSING, unclear, or too vague for an endorser application.

Context: Global Talent Visa is a two-stage process — (1) endorsement from ${route.endorser}, then (2) visa application to UKVI. These questions feed an AI assessment that scores endorsement readiness.
${techNationBlock}

DO NOT ask about:
- Education, job titles, companies, or dates already on the CV
- Technical skills or tools already listed
- Work history details already described
- Anything the CV already answers clearly

DO ask about (pick 5–8 only — NEVER more than 8 questions total, spread across categories):
- endorsement: Exceptional Talent vs Exceptional Promise; which mandatory criteria they can evidence
- uk_plan: specific UK roles, ventures, communities, or employers they will join/contribute to
- referees: how many senior experts identified (need 3 for Tech Nation); their relationship and seniority
- evidence: portfolio links, metrics, publications, open-source, patents, press — not on CV
- timeline: target endorsement submission date and urgency
- intent: dependants, current visa status, relocation constraints
- contact: email for follow-up (one short text field)

Question style:
- Frame labels in endorsement language (e.g. "UK contribution plan for your Tech Nation application")
- Hints should explain why endorsers need this and that it's not on the CV
- Use textarea for UK plan, evidence, and referee details; select for Talent vs Promise

Return ONLY valid JSON with 5–8 questions (hard limit: 8 items in the questions array):
{
  "resumeSummary": string (1 sentence — candidate profile + likely endorsement angle),
  "questions": [{
    "id": string (snake_case unique id),
    "label": string,
    "type": "text" | "textarea" | "select",
    "category": "endorsement" | "uk_plan" | "referees" | "evidence" | "timeline" | "intent" | "contact",
    "placeholder": string (optional),
    "hint": string (endorsement-focused — why we need this for Stage 1),
    "options": string[] (only for select type)
  }]
}`;

  const userPrompt = `Global Talent Visa route: ${route.label} (${route.endorser})

Resume:
${resumeText}

Generate personalised GTV Stage 1 endorsement intake questions.`;

  const content = await callOpenRouter(systemPrompt, userPrompt, {
    maxTokens: 4_000,
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("LLM returned invalid JSON for questions");
  }

  return generatedQuestionsSchema.parse(parsed);
}

/** Deep research assessment using CV + targeted answers */
export async function analyzeGlobalTalentAssessment(
  input: AnalyzeInput
): Promise<AssessmentResult> {
  const route = getRouteById(input.routeId);

  const answersBlock =
    input.questions && input.questions.length > 0
      ? input.questions
          .map((q) => {
            const answer = input.answers[q.id] ?? "";
            return `- ${q.label}: ${answer}`;
          })
          .join("\n")
      : Object.entries(input.answers)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join("\n");

  const systemPrompt = `You are a strict UK Global Talent Visa Stage 1 endorsement readiness assessor for the ${route.label} route (${route.endorser}).

Score endorsement readiness TODAY with current evidence — NOT future potential, NOT job prestige alone.

Tech Nation Digital Technology mandatory criteria (adapt for other routes):
${TECH_NATION_CRITERIA.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Positioning:
- Exceptional Promise: typically ≤5 years professional experience, must show potential beyond peers
- Exceptional Talent: typically 5+ years with sustained track record of leadership/contribution

SCORING RUBRIC — apply strictly:
Infer years of experience (YOE) from the CV dates. Be conservative.

YOE caps (unless extraordinary third-party evidence: major awards, peer-reviewed publications, widely adopted open-source, funded startup founder with traction):
- Under 2 years: score MUST NOT exceed 30
- 2–2.5 years: score MUST NOT exceed 40
- 2.5–3.5 years: score MUST NOT exceed 50
- 3.5–5 years (Exceptional Promise): typical range 35–55
- 5–7 years: typical range 45–65
- 7+ years with leadership: typical range 55–75

Score deductions (apply cumulatively where evidence is missing or weak):
- No credible UK contribution plan: −15 to −25
- No recognition beyond immediate occupation (speaking, judging, press, competitive awards): −15 to −20
- Innovation/contribution only self-reported in CV, no third-party validation: −15 to −25
- Fewer than 3 identifiable senior referees: −10 to −15
- Vague metrics or unverifiable claims: −10

Score bands:
- 0–35: Early stage — not endorsement-ready
- 36–50: Developing — multiple mandatory criteria unmet
- 51–65: Moderate — some strengths, material gaps remain
- 66–80: Strong — most criteria addressable with focused preparation
- 81–100: Near endorsement-ready — rare; requires strong evidence across ALL criteria

Do NOT inflate scores for impressive employers (FAANG, big tech), job titles, or technical stack lists alone. Junior engineers under 3 YOE should rarely score above 45 without exceptional external recognition.

The CV is primary evidence. Supplementary answers fill gaps — do not penalise for not repeating CV content in answers.

Return ONLY valid JSON — no markdown, no URLs, no commentary:
{
  "score": number (0-100),
  "route": string,
  "techNationFit": string (e.g. "Exceptional Promise — Digital Technology" or "Exceptional Talent — ..."),
  "summary": string (2-3 sentences — mention YOE, positioning, and why this score),
  "strengths": [{ "criterion": string, "detail": string }] (3-5),
  "gaps": [{ "criterion": string, "detail": string }] (3-5),
  "nextSteps": [{ "action": string, "priority": "high"|"medium"|"low", "timeline": string }] (4-6),
  "preparationTimeline": [{ "phase": string, "duration": string, "focus": string }] (4 phases)
}

Be specific to this applicant's CV and supplementary answers.`;

  const userPrompt = `Route: ${route.label} (${route.endorser})

Supplementary answers (gaps not in CV):
${answersBlock}

${input.resumeText ? `Resume text:\n${input.resumeText}` : "No resume text — assess from answers only."}

Assess endorsement readiness. Apply YOE caps strictly. Produce the JSON assessment.`;

  const content = await callOpenRouter(systemPrompt, userPrompt, {
    deepResearch: true,
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("LLM returned invalid JSON");
  }

  return assessmentResultSchema.parse(parsed);
}

type EvidenceReviewInput = {
  criterionId: string;
  uploads: UploadedEvidence[];
};

const OUTPUT_SCHEMA = `Return ONLY valid JSON — no markdown, no URLs:
{
  "criterion": string (criterion section title),
  "track": string (evidence template label),
  "score": number (0-100),
  "riskBand": "high_rejection_risk" | "borderline" | "strong_readiness" | "near_ready",
  "riskSummary": string,
  "positioning": string (Exceptional Talent vs Exceptional Promise),
  "summary": string,
  "evidenceAssessments": [{
    "evidenceType": string,
    "fileName": string,
    "strength": "strong" | "partial" | "weak" | "not_assessable",
    "detail": string,
    "endorserSignal": string
  }],
  "mandatoryMapping": [{
    "criterion": string,
    "status": "met" | "partial" | "weak" | "missing",
    "detail": string
  }],
  "gaps": [{ "area": string, "detail": string, "severity": "critical" | "major" | "minor" }],
  "recommendations": [{ "action": string, "priority": "high" | "medium" | "low", "timeline": string }]
}`;

/** Slot-specific Tech Nation LoR guidance — each of the 3 letters has a distinct role */
function buildLorSlotGuidance(template: "lor1" | "lor2" | "lor3"): string {
  const guidance: Record<"lor1" | "lor2" | "lor3", string> = {
    lor1: `LETTER 1 ROLE — establish foundational credibility:
- Typically from the most senior referee who knows the candidate's core work (CEO, CTO, VP Engineering, distinguished professor)
- Opens the reference pack: WHO the candidate is as a leading digital technologist and WHY they are exceptional
- Referee must state their own credentials — title, organisation, years in field, and why they are qualified to judge exceptional talent/promise
- Requires 2–3 specific exemplar projects with measurable outcomes the referee witnessed firsthand (dates, scale, candidate's personal contribution)
- May be from a direct senior leader — acceptable IF depth and specificity are exceptional, not a generic manager endorsement
- Flag if the letter reads like a performance review, HR template, or LinkedIn recommendation`,

    lor2: `LETTER 2 ROLE — independence + different lens (critical for Tech Nation):
- Tech Nation expects at least one referee who is NOT the candidate's line manager or direct employer
- Must cover DIFFERENT projects, criteria, or recognition than Letter 1 — assessors reject duplicate packs
- Ideal referees: external expert, major client, advisory board member, collaborator, academic supervisor, open-source peer, investor who worked with the candidate
- Demonstrates recognition extends BEYOND the immediate workplace — national/international field standing
- Cross-sector or international perspective is a strong endorser signal
- Penalise heavily if Letter 2 is from the same employer with overlapping projects and phrasing to Letter 1`,

    lor3: `LETTER 3 ROLE — round out the evidence pack:
- Complements Letters 1 and 2 — voluntary contribution, innovation, speaking, or a distinct technical/commercial angle
- Often from a different senior expert attesting to a specific achievement (conference organiser, peer founder, standards body chair, community leader)
- Should address mandatory-criteria themes not clearly covered by typical Letters 1 & 2 (external recognition, sector contribution, innovation)
- Avoid repeating the same projects and superlatives — flag template or copy-paste packs
- Strong Letter 3 adds a new dimension: sector advancement, mentoring at scale, published thought leadership, or open-source impact`,
  };

  return guidance[template];
}

function buildLorPrompt(
  template: "lor1" | "lor2" | "lor3",
  sectionBlock: string,
  optionLabel: string
): string {
  const slot =
    template === "lor1" ? "1st" : template === "lor2" ? "2nd" : "3rd";

  return `You are a strict Tech Nation Digital Technology Stage 1 letter of reference reviewer.

${sectionBlock}

You are reviewing ${optionLabel} — the ${slot} of 3 required endorsement letters.
Score THIS letter only. Do not assume quality of the other two letters.

${buildLorSlotGuidance(template)}

LETTER OF REFERENCE RUBRIC — assess like a Tech Nation assessor:

1. REFEREE CREDIBILITY (critical)
   - Is the referee a senior digital technology expert (not HR, not junior peer)?
   - Credentials stated: current title, organisation, field standing, relationship to candidate, duration known (ideally 2+ years)?
   - Does the referee explain WHY they are qualified to judge exceptional talent or promise?
   - Red flags: unsigned drafts, anonymous author, HR/recruiting contact, referee with no digital tech credentials

2. SPECIFICITY & EVIDENCE QUALITY
   - Concrete projects, innovations, metrics, dates, and outcomes — NOT "great team player" or "hard worker"
   - Cross-checkable examples: product names, revenue/scale figures, awards, publications, speaking venues
   - Clear personal ownership — what did the CANDIDATE do vs the team?
   - Weak signals: CV bullet rephrasing, buzzwords without proof, vague superlatives, template paragraphs

3. CRITERIA ALIGNMENT
   - Does the letter address leading talent / exceptional promise in digital technology?
   - Innovation, external recognition, significant contribution, or sector advancement themes present?
   - Exceptional Talent vs Promise positioning consistent with examples cited?
   - Letters SUPPORT evidence — they never replace MC/OC documents. Flag if letter is the only proof offered.

4. INDEPENDENCE & COMPLEMENTARITY
   - For Letter 2: independence from employer is especially important — state clearly if missing
   - For Letter 3: does it add a distinct angle vs what Letters 1 & 2 typically cover?
   - Flag duplicate content, identical phrasing, or all three letters from same company hierarchy

5. FORMAL & PROFESSIONAL REQUIREMENTS
   - Letterhead or official organisation branding, date, signature block, contact details
   - Professional length (typically 1–2 pages); structured paragraphs an assessor can scan
   - Written in endorsement language — not a job reference for hiring

RED FLAGS (auto-penalise):
- Generic praise with zero metrics or named projects
- Letter written by candidate or clearly ghost-written (first-person slips, unnatural uniformity)
- Referee is peer-level or subordinate
- Only describes job duties, not exceptional achievement
- No relationship context or duration known
- Reads like it was prepared solely for visa timing with no prior relationship evidence

SCORING (this letter only — be conservative):
- 0–35 high_rejection_risk: generic praise, no examples, weak/non-credible referee, HR-style letter
- 36–50 borderline: some content but vague examples, employer-only referee for Letter 2, or missing credentials
- 51–65 borderline/strong: credible referee with good examples but gaps in independence, metrics, or criteria language
- 66–80 strong_readiness: senior referee, specific endorser-ready examples, clear criteria alignment
- 81–100 near_ready: exceptional — rare; independent senior expert with rich, cross-checkable detail

In mandatoryMapping assess exactly these dimensions:
- Referee seniority & credibility
- Example specificity & metrics
- Independence from employer (weight heavily for Letter 2)
- Mandatory criteria coverage in letter text
- Letter formality (letterhead, date, signature)
- Complementarity with other letters (expected role for this slot)

In evidenceAssessments, extract referee name/title if present and quote the strongest and weakest passages.
In gaps, list what is missing for THIS letter slot to meet Tech Nation standards.
In recommendations, give actionable bullet points the referee should add — specific metrics, projects, criteria phrases, and independence notes. Frame as "Ask your referee to…" guidance.

Set "positioning" to the Exceptional Talent vs Promise read implied by the letter (or "Unclear" if not stated).

${OUTPUT_SCHEMA}`;
}

/** Template-specific prompts — aligned with official Tech Nation criteria */
function buildTemplatePrompt(
  criterionId: string,
  template: string,
  optionLabel: string
): string {
  const section = getTechNationCriterion(criterionId);
  if (!section) throw new Error(`Unknown criterion: ${criterionId}`);

  const sectionBlock = `CRITERION SECTION: ${section.title}
OFFICIAL QUESTION: ${section.question}
ENDORSER GUIDANCE: ${section.explanation}
EVIDENCE TEMPLATE: ${optionLabel} (${template})
Select ${section.minSelect}–${section.maxSelect} evidence types for a full application (ideal: ${section.idealSelect}). This review assesses ONE uploaded document only.`;

  if (template === "ps") {
    return `You are a strict Tech Nation Digital Technology Stage 1 personal statement reviewer.

${sectionBlock}

PERSONAL STATEMENT RUBRIC — assess like a Tech Nation assessor:

1. POSITIONING (critical): Exceptional Talent vs Exceptional Promise stated and justified? Talent = sustained track record (5+ years typical); Promise = emerging recognition (≤5 years). Penalise misalignment.

2. UK CONTRIBUTION PLAN: Specific UK employers, ventures, sectors, communities, timelines — NOT generic relocation intent. Credible next steps required.

3. CAREER NARRATIVE: Coherent leading-talent story — NOT a CV reprint. Quantified impact with clear personal ownership. Emphasis on last 5 years.

4. MANDATORY CRITERIA ALIGNMENT: Recognition as leading talent in digital technology? Innovation, external recognition, contribution themes present?

5. WRITING QUALITY: Structure, clarity, endorser-scannable sections. Red flags: buzzwords, templates, unsupported superlatives.

SCORING:
- 0–35 high_rejection_risk: generic, no UK plan, unclear positioning
- 36–50 borderline: weak UK plan or vague impact
- 51–65 borderline/strong: clear narrative with gaps
- 66–80 strong_readiness: strong positioning and UK plan; minor polish
- 81–100 near_ready: compelling, specific, endorser-ready

In mandatoryMapping assess: Positioning, UK contribution plan, Recognition narrative, Innovation/contribution signals, Evidence pack alignment.
In recommendations give specific rewrite suggestions — sections to add, metrics to include, sentences to strengthen.

${OUTPUT_SCHEMA}`;
  }

  if (template === "lor1" || template === "lor2" || template === "lor3") {
    return buildLorPrompt(template, sectionBlock, optionLabel);
  }

  if (template === "product-led-growth") {
    return `You are a strict Tech Nation Digital Technology evidence reviewer for Mandatory Criteria — Product Led Growth template.

${sectionBlock}

PLG-SPECIFIC RUBRIC:
1. Recognition as leading talent — sustained national/international recognition in digital technology, not routine PM/growth role
2. Activity within past 5 years — consistent track record; reject evidence made solely for application timing
3. PLG innovation — novel product-led motion (self-serve funnel, PQL, viral loops, freemium conversion) NOT paid marketing ops alone
4. Measurable impact — baseline → intervention → outcome with clear personal ownership
5. Commercial significance — ARR/MRR, expansion revenue, or unit economics at meaningful scale
6. Letters alone insufficient — document must contain substantive evidence beyond referee praise

SCORING:
- 0–35 high_rejection_risk: vague PLG claims, vanity metrics, indistinguishable from standard role
- 36–50 borderline: some metrics, weak recognition or innovation narrative
- 51–65 borderline/strong: clear PLG outcomes, gaps in scale or external validation
- 66–80 strong_readiness: strong document with metrics and leadership clarity
- 81–100 near_ready: rare — exceptional PLG innovation with third-party validation

In mandatoryMapping, assess how this PLG evidence supports the Mandatory Criteria question (leading talent recognition in last 5 years).

${OUTPUT_SCHEMA}`;
  }

  return `You are a strict Tech Nation Digital Technology evidence reviewer.

${sectionBlock}

Apply the official endorser guidance for this criterion section strictly.
- Letters of reference alone are NOT sufficient
- Evidence must show personal contribution, not team/company achievements without clarity
- Reject evidence created solely to support application timing
- For OC1 (Innovation): require innovation not just impact; financial docs alone insufficient
- For OC2 (Voluntary): must be non-paid, not representing a company; online-only mentoring insufficient
- For OC3A/OC3B: impact not innovation; differentiate from OC1 if same evidence submitted elsewhere
- For OC4 (Academia): requires peer review or senior academic endorsement

Score conservatively. Assess rejection risk if submitted today with this document only.

${OUTPUT_SCHEMA}`;
}

/** Deep-research evidence review for a Tech Nation criterion + template */
export async function reviewTechNationEvidence(
  input: EvidenceReviewInput
): Promise<EvidenceReviewResult> {
  const section = getTechNationCriterion(input.criterionId);
  if (!section) {
    throw new Error(`Unknown criterion: ${input.criterionId}`);
  }

  const upload = input.uploads[0];
  if (!upload) throw new Error("No evidence uploaded");

  const option = getEvidenceOption(input.criterionId, upload.evidenceId);
  const template = upload.template ?? option?.template ?? upload.evidenceId;
  const optionLabel = option?.label ?? template;

  const systemPrompt = buildTemplatePrompt(
    input.criterionId,
    template,
    optionLabel
  );

  const isLor =
    template === "lor1" || template === "lor2" || template === "lor3";

  const lorInstructions = isLor
    ? `
This is a Letter of Reference review. Extract the referee's name, title, and organisation if stated.
Identify the strongest specific example and the weakest/generic passage.
Score only this letter — do not infer the quality of the other two letters in the pack.
If the referee appears to be the candidate's line manager, note it and apply independence penalties (especially for Letter 2).
`
    : "";

  const userPrompt = `Review this uploaded evidence document.

Criterion section: ${section.title}
Template: ${optionLabel}
File: ${upload.fileName}
${lorInstructions}
Document text:
${upload.text}

Produce the JSON assessment. Set "criterion" to "${section.title}" and "track" to "${optionLabel}".`;

  const content = await callOpenRouter(systemPrompt, userPrompt, {
    deepResearch: true,
    maxTokens: 12_000,
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("LLM returned invalid JSON for evidence review");
  }

  return evidenceReviewResultSchema.parse(parsed);
}
