"use client";

import { TimelineLoader } from "@/components/assessment/TimelineLoader";
import {
  getEvidenceOption,
  getTechNationCriterion,
} from "@/lib/evidence-review";

type Props = {
  criterionId: string;
  optionId: string;
  /** Set true when the analyze API has returned */
  externalReady?: boolean;
  onComplete?: () => void;
};

/** Timeline loader — final step completes only after AI response */
export function EvidenceReviewLoading({
  criterionId,
  optionId,
  externalReady = false,
  onComplete,
}: Props) {
  const criterion = getTechNationCriterion(criterionId);
  const option = getEvidenceOption(criterionId, optionId);
  const isPlg = option?.template === "product-led-growth";
  const isPs = option?.template === "ps";
  const isLor =
    option?.template === "lor1" ||
    option?.template === "lor2" ||
    option?.template === "lor3";

  return (
    <TimelineLoader
      title="Reviewing your document"
      subtitle={`${criterion?.title ?? "Tech Nation"} · ${option?.label ?? "Evidence"}`}
      badge="Deep research"
      stepDuration={2800}
      waitForExternal
      externalReady={externalReady}
      completeHoldMs={400}
      onComplete={onComplete}
      footer="Tech Nation-style review — usually 30–60 seconds"
      steps={[
        {
          id: "extract",
          title: "Reading your document",
          description: "Extracting text from your uploaded PDF or Word file.",
          detail: `Template: ${option?.label ?? optionId}`,
        },
        {
          id: "research",
          title: "Deep research — Tech Nation standards",
          description: "Checking endorsement guidance and assessor expectations.",
          detail: isPs
            ? "Personal statement · ET vs EP · UK plan · MC alignment"
            : isLor
              ? "Letter of reference · referee seniority · specific examples"
              : isPlg
                ? "PLG mandatory criteria · innovation vs growth marketing"
                : criterion?.title ?? "Tech Nation rubric",
        },
        {
          id: "rubric",
          title: "Applying review rubric",
          description: criterion?.question ?? "Scoring against endorser expectations.",
          detail: isPs
            ? "Positioning, UK plan, narrative, writing quality"
            : isLor
              ? "Credibility, specificity, independence, criteria coverage"
              : option?.explanation ?? "Template-specific assessment",
        },
        {
          id: "risk",
          title: "Generating suggestions",
          description: "Score, gaps, and actionable rewrite recommendations.",
          detail: "Waiting for AI review to finish…",
        },
      ]}
    />
  );
}
