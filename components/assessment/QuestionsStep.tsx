"use client";

import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  getRouteById,
  GT_QUESTION_CATEGORIES,
  type DynamicQuestion,
  type GtQuestionCategory,
  type GtRouteId,
} from "@/lib/assessment";

const inputClass =
  "bg-surface-elevated text-text-primary placeholder:text-text-muted focus-visible:ring-linear-accent";

/** Group order for endorsement intake sections */
const CATEGORY_ORDER: GtQuestionCategory[] = [
  "endorsement",
  "uk_plan",
  "referees",
  "evidence",
  "timeline",
  "intent",
  "contact",
];

type Props = {
  routeId: GtRouteId;
  questions: DynamicQuestion[];
  resumeSummary: string;
  answers: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

function groupQuestions(questions: DynamicQuestion[]) {
  const groups = new Map<GtQuestionCategory | "other", DynamicQuestion[]>();

  for (const q of questions) {
    const key = q.category ?? "other";
    const list = groups.get(key) ?? [];
    list.push(q);
    groups.set(key, list);
  }

  const ordered: { key: GtQuestionCategory | "other"; items: DynamicQuestion[] }[] =
    [];

  for (const cat of CATEGORY_ORDER) {
    const items = groups.get(cat);
    if (items?.length) ordered.push({ key: cat, items });
  }

  const other = groups.get("other");
  if (other?.length) ordered.push({ key: "other", items: other });

  return ordered;
}

/** Step 3 — LLM-generated GTV endorsement intake questions */
export function QuestionsStep({
  routeId,
  questions,
  resumeSummary,
  answers,
  onChange,
}: Props) {
  const route = getRouteById(routeId);
  const groups = groupQuestions(questions);
  let questionIndex = 0;

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-text-muted">
          Step 3 · {route.label} · Stage 1 endorsement
        </p>
        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          Endorsement intake questions
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          We read your CV for work history and skills. These questions cover what
          endorsers need for your{" "}
          <span className="text-text-primary">{route.endorser}</span> application
          — UK plan, referees, evidence, and positioning — without repeating
          your resume.
        </p>
      </div>

      {resumeSummary && (
        <div className="mb-6 flex gap-3 rounded-lg border border-linear-accent/20 bg-linear-accent-muted/20 px-4 py-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-linear-accent" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              From your CV — already captured
            </p>
            <p className="mt-1 text-sm text-text-secondary">{resumeSummary}</p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.key}>
            {group.key !== "other" && (
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-linear-accent-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-linear-accent">
                  {GT_QUESTION_CATEGORIES[group.key]}
                </span>
              </div>
            )}

            <div className="space-y-6">
              {group.items.map((q) => {
                questionIndex += 1;
                const num = questionIndex;

                return (
                  <div
                    key={q.id}
                    className="rounded-lg border border-white/[0.06] bg-surface-elevated p-4"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-linear-accent-muted text-[10px] font-semibold text-linear-accent">
                        {num}
                      </span>
                      <div>
                        <Label
                          htmlFor={q.id}
                          className="text-sm font-medium text-text-primary"
                        >
                          {q.label}
                        </Label>
                        {q.hint && (
                          <p className="mt-1 text-xs text-text-muted">{q.hint}</p>
                        )}
                      </div>
                    </div>

                    {q.type === "textarea" ? (
                      <Textarea
                        id={q.id}
                        rows={3}
                        value={answers[q.id] ?? ""}
                        onChange={(e) => onChange(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        className={inputClass}
                      />
                    ) : q.type === "select" ? (
                      <select
                        id={q.id}
                        value={answers[q.id] ?? ""}
                        onChange={(e) => onChange(q.id, e.target.value)}
                        className={`${inputClass} h-10 w-full rounded-md border border-white/[0.08] px-3 text-sm`}
                      >
                        <option value="">Select…</option>
                        {(q.options ?? []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={q.id}
                        type="text"
                        value={answers[q.id] ?? ""}
                        onChange={(e) => onChange(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        className={inputClass}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
