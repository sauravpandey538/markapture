"use client";

import { CheckCircle2, FileText } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { getTechNationCriterion } from "@/lib/evidence-review";
import { cn } from "@/lib/utils";

type Props = {
  criterionId: string;
  selected: string | null;
  onSelect: (optionId: string) => void;
  onContinue: () => void;
};

/** Step 2 — pick specific evidence template within the criterion */
export function EvidenceSelectStep({
  criterionId,
  selected,
  onSelect,
  onContinue,
}: Props) {
  const criterion = getTechNationCriterion(criterionId);
  if (!criterion) return null;

  const isLor = criterionId === "lor";
  const isPs = criterionId === "ps";

  const stepDescription = isLor
    ? "Choose which letter you are uploading (1, 2, or 3). Each letter has a different role in your endorsement pack — review them one at a time."
    : isPs
      ? null
      : "Pick the template that matches the document you prepared. For Product Led Growth, select it below then upload your document on the next step.";

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-text-muted">
          Step 2 · {criterion.title}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          {isLor ? "Which letter are you uploading?" : "Choose your evidence type"}
        </h2>
        {stepDescription && (
          <p className="mt-2 text-sm text-text-secondary">{stepDescription}</p>
        )}
      </div>

      <div className="mb-4 rounded-lg bg-surface-elevated px-4 py-3 text-xs leading-relaxed text-text-secondary">
        <p className="font-medium text-text-primary">Endorser guidance</p>
        <p className="mt-1 line-clamp-4">{criterion.explanation}</p>
      </div>

      <div className="space-y-2">
        {criterion.options.map((option) => {
          const isSelected = selected === option.id;
          const isPlg = option.template === "product-led-growth";
          const isLorOption =
            option.template === "lor1" ||
            option.template === "lor2" ||
            option.template === "lor3";

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={cn(
                "w-full rounded-xl p-4 text-left transition-all",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                isPlg && !isSelected && "border border-linear-accent/15",
                isSelected
                  ? "bg-linear-accent-muted shadow-[inset_0_0_0_1px_rgba(94,106,210,0.4)]"
                  : "bg-surface-elevated hover:bg-surface"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <FileText
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      isSelected ? "text-linear-accent" : "text-text-muted"
                    )}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-text-primary">
                        {option.label}
                      </p>
                      {isPlg && (
                        <span className="rounded-full bg-linear-accent-muted px-2 py-0.5 text-[9px] font-medium text-linear-accent">
                          Upload one document
                        </span>
                      )}
                      {isLorOption && option.template === "lor2" && (
                        <span className="rounded-full bg-linear-accent-muted px-2 py-0.5 text-[9px] font-medium text-linear-accent">
                          Independence preferred
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                      {option.explanation}
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

      <div className="mt-8">
        <CTAButton
          type="button"
          onClick={onContinue}
          disabled={!selected}
          className="w-full sm:w-auto"
        >
          Continue to upload
        </CTAButton>
      </div>
    </div>
  );
}
