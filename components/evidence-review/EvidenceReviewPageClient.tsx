"use client";

import { Suspense } from "react";
import { EvidenceReviewWizard } from "@/components/evidence-review/EvidenceReviewWizard";

type Props = {
  initialCriterion?: string;
  initialEvidence?: string;
  initialPage?: string;
};

export function EvidenceReviewPageClient({
  initialCriterion,
  initialEvidence,
  initialPage,
}: Props) {
  return (
    <Suspense
      fallback={
        <div
          className="h-96 animate-pulse rounded-xl bg-surface-elevated"
          aria-label="Loading evidence review"
        />
      }
    >
      <EvidenceReviewWizard
        initialCriterion={initialCriterion}
        initialEvidence={initialEvidence}
        initialPage={initialPage}
      />
    </Suspense>
  );
}
