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
