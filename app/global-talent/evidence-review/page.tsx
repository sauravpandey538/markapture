import type { Metadata } from "next";
import { EvidenceReviewPageClient } from "@/components/evidence-review/EvidenceReviewPageClient";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Tech Nation Evidence Review - Markapture",
  description:
    "Upload Tech Nation endorsement evidence by criterion section and template. AI reviews Product Led Growth and optional criteria with rejection-risk scoring.",
};

export default function EvidenceReviewPage({
  searchParams,
}: {
  searchParams: { criterion?: string; evidence?: string; page?: string };
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="glow-orb glow-orb-purple -right-32 top-0 size-[500px]"
        aria-hidden
      />
      <div className="page-container py-16 md:py-24">
        <SectionHeader
          eyebrow="Evidence review"
          title="Tech Nation evidence checker"
          description="Upload your Personal Statement or Letters of Reference, or evidence for Mandatory / Optional criteria. AI reviews each document with Tech Nation assessor-style feedback and rewrite suggestions."
          className="max-w-2xl"
        />
        <div className="mt-12">
          <EvidenceReviewPageClient
            initialCriterion={searchParams.criterion}
            initialEvidence={searchParams.evidence}
            initialPage={searchParams.page}
          />
        </div>
      </div>
    </section>
  );
}
