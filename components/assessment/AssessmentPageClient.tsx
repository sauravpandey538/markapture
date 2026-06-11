"use client";

import { Suspense } from "react";
import { AssessmentWizard } from "@/components/assessment/AssessmentWizard";

type Props = {
  initialPage?: string;
  initialRoute?: string;
};

/** Suspense boundary required for useSearchParams in AssessmentWizard */
export function AssessmentPageClient({ initialPage, initialRoute }: Props) {
  return (
    <Suspense
      fallback={
        <div
          className="h-96 animate-pulse rounded-xl bg-surface-elevated"
          aria-label="Loading assessment"
        />
      }
    >
      <AssessmentWizard
        initialPage={initialPage}
        initialRoute={initialRoute}
      />
    </Suspense>
  );
}
