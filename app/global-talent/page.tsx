import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { ResumeScannerMock } from "@/components/product/ResumeScannerMock";
import { GLOBAL_TALENT_TIMELINE } from "@/lib/timelines";

export const metadata: Metadata = {
  title: "Global Talent Endorsement - Markapture",
  description:
    "Structured preparation for the UK Global Talent Visa endorsement — digital technology, research, arts, and academia routes.",
};

export default function GlobalTalentPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="glow-orb glow-orb-purple -right-32 top-0 size-[500px]" aria-hidden />
        <div className="page-container grid items-center gap-16 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Global Talent"
              title="Exceptional talent, structured evidence"
              description="The Global Talent route requires demonstrable exceptional ability or promise. We map your evidence, refine your narrative, and align referees — primarily for Digital Technology (Tech Nation) and related fields."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="/global-talent/assessment">
                Free assessment
              </CTAButton>
              <CTAButton href="/global-talent/evidence-review" variant="secondary">
                Evidence review
              </CTAButton>
              <CTAButton href="/book-consultation" variant="secondary">
                Book consultation
              </CTAButton>
            </div>
          </div>
          <ResumeScannerMock title="markapture — global talent scan" />
        </div>
      </section>

      <section className="section-band py-24 md:py-32">
        <div className="page-container">
          <SectionHeader
            eyebrow="Preparation timeline"
            title="How we prepare you"
            description="A typical Global Talent journey spans 5–8 weeks. Each phase ends with tangible deliverables — not vague advice."
          />
          <div className="mt-16">
            <ProcessTimeline steps={GLOBAL_TALENT_TIMELINE} />
          </div>
        </div>
      </section>
    </>
  );
}
