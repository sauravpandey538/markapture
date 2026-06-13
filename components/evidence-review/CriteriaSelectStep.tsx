"use client";

import { CheckCircle2, FileText, HelpCircle } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import {
  criterionHasSingleOption,
  TECH_NATION_CRITERIA_DATA,
} from "@/lib/evidence-review";
import { cn } from "@/lib/utils";

type Props = {
  selected: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
};

const APPLICATION_DOC_IDS = new Set(["ps", "lor"]);

/** Step 1 — pick document type: Personal Statement, LoR, MC, or OC */
export function CriteriaSelectStep({ selected, onSelect, onContinue }: Props) {
  const applicationDocs = TECH_NATION_CRITERIA_DATA.filter((c) =>
    APPLICATION_DOC_IDS.has(c.id)
  );
  const evidenceCriteria = TECH_NATION_CRITERIA_DATA.filter(
    (c) => !APPLICATION_DOC_IDS.has(c.id)
  );

  const continueLabel =
    selected && criterionHasSingleOption(selected)
      ? "Upload document"
      : "Choose evidence type";

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-text-muted">
          Step 1
        </p>
        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          What do you want reviewed?
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Start with your Personal Statement or a Letter of Reference, or
          review evidence for Mandatory / Optional criteria.
        </p>
      </div>

      <CriterionGroup
        title="Application documents"
        description="Upload a PDF — AI reviews like a Tech Nation assessor"
        criteria={applicationDocs}
        selected={selected}
        onSelect={onSelect}
      />

      <CriterionGroup
        title="Evidence criteria"
        description="Mandatory (MC) and Optional criteria (OC1–OC4)"
        criteria={evidenceCriteria}
        selected={selected}
        onSelect={onSelect}
        className="mt-6"
      />

      <div className="mt-8">
        <CTAButton
          type="button"
          onClick={onContinue}
          disabled={!selected}
          className="w-full sm:w-auto"
        >
          {continueLabel}
        </CTAButton>
      </div>
    </div>
  );
}

function CriterionGroup({
  title,
  description,
  criteria,
  selected,
  onSelect,
  className,
}: {
  title: string;
  description: string;
  criteria: (typeof TECH_NATION_CRITERIA_DATA)[number][];
  selected: string | null;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-3">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>

      <div className="space-y-2">
        {criteria.map((criterion) => {
          const isSelected = selected === criterion.id;
          const isAppDoc = APPLICATION_DOC_IDS.has(criterion.id);
          const isPs = criterion.id === "ps";

          return (
            <button
              key={criterion.id}
              type="button"
              onClick={() => onSelect(criterion.id)}
              className={cn(
                "w-full rounded-xl p-4 text-left transition-all",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                isPs && !isSelected && "border border-linear-accent/15",
                isSelected
                  ? "bg-linear-accent-muted shadow-[inset_0_0_0_1px_rgba(94,106,210,0.4)]"
                  : "bg-surface-elevated hover:bg-surface"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {isAppDoc ? (
                    <FileText
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        isSelected ? "text-linear-accent" : "text-text-muted"
                      )}
                    />
                  ) : (
                    <HelpCircle
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        isSelected ? "text-linear-accent" : "text-text-muted"
                      )}
                    />
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-text-primary">
                        {criterion.title}
                      </p>
                      {isPs && (
                        <span className="rounded-full bg-linear-accent-muted px-2 py-0.5 text-[9px] font-medium text-linear-accent">
                          Most popular
                        </span>
                      )}
                      {criterion.id === "lor" && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
                          3 letters
                        </span>
                      )}
                      {isAppDoc && (
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-text-muted">
                          PDF upload
                        </span>
                      )}
                      {criterion.id === "mandatory" && (
                        <span className="rounded-full bg-linear-accent-muted px-2 py-0.5 text-[9px] font-medium text-linear-accent">
                          Required
                        </span>
                      )}
                      {!isAppDoc && (
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-text-muted">
                          Pick {criterion.idealSelect} of {criterion.maxSelect}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary line-clamp-3">
                      {criterion.question}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="size-4 shrink-0 text-linear-accent" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
