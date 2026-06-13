"use client";

import { FileText, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEvidenceOption, getTechNationCriterion } from "@/lib/evidence-review";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type Props = {
  criterionId: string;
  optionId: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string | null;
};

/** Step 3 — upload prepared evidence document for the selected template */
export function EvidenceUploadStep({
  criterionId,
  optionId,
  file,
  onFileChange,
  error,
}: Props) {
  const criterion = getTechNationCriterion(criterionId);
  const option = getEvidenceOption(criterionId, optionId);
  if (!criterion || !option) return null;

  const isPs = criterionId === "ps";
  const isLor = criterionId === "lor";

  const uploadTitle = isPs
    ? "Upload your personal statement"
    : isLor
      ? "Upload your letter of reference"
      : "Upload your evidence document";

  const aiChecks = isPs
    ? [
        "Exceptional Talent vs Promise positioning",
        "UK contribution plan specificity",
        "Career narrative and mandatory criteria alignment",
        "Rewrite suggestions to strengthen your statement",
      ]
    : isLor
      ? [
          "Referee seniority, credentials, and relationship to you",
          "Specific projects, metrics, and criteria-aligned examples",
          "Independence and complementarity for this letter slot",
          "What to ask your referee to add before submission",
        ]
      : [
          `Whether this document meets the ${criterion.title} rubric`,
          `Strength of evidence for "${option.label}"`,
          "Rejection risk if submitted today with this document",
          "Gaps and recommendations specific to this template",
        ];

  const handleFile = (selected: File | null) => {
    if (!selected) {
      onFileChange(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) return;
    onFileChange(selected);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-text-muted">
          Step 3 · {criterion.title}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          {uploadTitle}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Upload your prepared <strong className="font-medium text-text-primary">{option.label}</strong> document. PDF or Word (.docx), max 5 MB.
        </p>
      </div>

      <div
        className={cn(
          "rounded-xl border border-dashed p-8 text-center transition-colors",
          file
            ? "border-linear-accent/40 bg-linear-accent-muted/30"
            : "border-white/[0.1] bg-surface-elevated"
        )}
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-surface">
          {file ? (
            <FileText className="size-5 text-linear-accent" />
          ) : (
            <Upload className="size-5 text-text-muted" />
          )}
        </div>

        <p className="text-sm font-medium text-text-primary">{option.label}</p>
        <p className="mt-1 text-xs text-text-muted">{option.explanation}</p>

        {file ? (
          <div className="mt-4">
            <p className="text-sm text-text-primary">{file.name}</p>
            <p className="mt-1 text-xs text-text-muted">
              {(file.size / 1024).toFixed(0)} KB
            </p>
            <button
              type="button"
              onClick={() => onFileChange(null)}
              className="mt-3 text-xs text-text-secondary underline hover:text-text-primary"
            >
              Remove and choose another
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <Label
              htmlFor={`evidence-file-${optionId}`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-linear-accent px-4 py-2 text-sm font-medium text-white hover:bg-linear-accent-hover"
            >
              <Upload className="size-3.5" />
              Choose file
            </Label>
          </div>
        )}

        <Input
          id={`evidence-file-${optionId}`}
          type="file"
          accept=".pdf,.doc,.docx"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <div className="mt-6 rounded-lg bg-surface-elevated px-4 py-3 text-xs text-text-secondary">
        <p className="font-medium text-text-primary">What the AI checks</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {aiChecks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
