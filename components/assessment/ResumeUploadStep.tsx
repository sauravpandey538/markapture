"use client";

import { FileText, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRouteById, type GtRouteId } from "@/lib/assessment";
import { cn } from "@/lib/utils";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

type Props = {
  routeId: GtRouteId;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string | null;
};

/** Step 2 — upload resume first; LLM generates questions from CV content */
export function ResumeUploadStep({
  routeId,
  file,
  onFileChange,
  error,
}: Props) {
  const route = getRouteById(routeId);

  const handleFile = (selected: File | null) => {
    if (!selected) {
      onFileChange(null);
      return;
    }
    if (selected.size > MAX_RESUME_SIZE) return;
    onFileChange(selected);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-text-muted">
          Step 2 · {route.label}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          Upload your resume
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          We&apos;ll read your CV first, then ask only the questions your resume
          doesn&apos;t answer — so you never type the same thing twice.
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

        {file ? (
          <div>
            <p className="text-sm font-medium text-text-primary">{file.name}</p>
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
          <div>
            <p className="text-sm text-text-secondary">
              PDF or Word (.docx), max 5 MB
            </p>
            <Label
              htmlFor="assessment-resume"
              className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md bg-linear-accent px-4 py-2 text-sm font-medium text-white hover:bg-linear-accent-hover"
            >
              <Upload className="size-3.5" />
              Choose file
            </Label>
          </div>
        )}

        <Input
          id="assessment-resume"
          type="file"
          accept=".pdf,.doc,.docx"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <div className="mt-6 rounded-lg bg-surface-elevated px-4 py-3 text-xs text-text-secondary">
        <p className="font-medium text-text-primary">What happens next</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>AI reads your CV and maps it to {route.endorser} criteria</li>
          <li>Generates 5–8 personalised questions (gaps only)</li>
          <li>Full assessment with strengths, gaps, and timeline</li>
        </ul>
      </div>
    </div>
  );
}
