import type { Metadata } from "next";
import { AssessmentPageClient } from "@/components/assessment/AssessmentPageClient";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Global Talent Assessment - Markapture",
  description:
    "Free AI-powered Global Talent Visa assessment. Choose your path, answer questions, upload your resume, and get strengths, gaps, and a preparation timeline.",
};

export default function GlobalTalentAssessmentPage({
  searchParams,
}: {
  searchParams: { page?: string; route?: string };
}) {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="glow-orb glow-orb-purple -right-32 top-0 size-[500px]"
          aria-hidden
        />
        <div className="page-container py-16 md:py-24">
          <SectionHeader
            eyebrow="Free assessment"
            title="Global Talent readiness check"
            description="Choose your path, upload your resume, and answer only the questions your CV doesn't cover. Our AI maps your profile against endorser criteria and returns strengths, gaps, and a week-by-week preparation plan."
            className="max-w-2xl"
          />
          <div className="mt-12">
            <AssessmentPageClient
              initialPage={searchParams.page}
              initialRoute={searchParams.route}
            />
          </div>
        </div>
      </section>
    </>
  );
}
