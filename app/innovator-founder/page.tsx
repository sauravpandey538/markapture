import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { InnovatorFounderMock } from "@/components/product/InnovatorFounderMock";
import { INNOVATOR_FOUNDER_TIMELINE } from "@/lib/timelines";

export const metadata: Metadata = {
  title: "Innovator Founder Endorsement - Markapture",
  description:
    "Endorsement preparation for the UK Innovator Founder visa — innovation thesis, business plan, and founder evidence review.",
};

export default function InnovatorFounderPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="glow-orb glow-orb-purple -left-32 top-0 size-[500px]" aria-hidden />
        <div className="page-container grid items-center gap-16 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Innovator Founder"
              title="Innovation that endorsers can verify"
              description="This route demands a credible, innovative, and scalable business idea with a viable UK growth plan. We help founders articulate innovation, strengthen evidence, and survive endorser scrutiny."
            />
            <div className="mt-8">
              <CTAButton href="/book-consultation">Book consultation</CTAButton>
            </div>
          </div>
          <InnovatorFounderMock />
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="page-container">
          <SectionHeader
            eyebrow="Preparation timeline"
            title="How we prepare you"
            description="Innovator Founder preparation is founder-led. We stress-test your innovation thesis, business plan, and UK market story across four structured phases."
          />
          <div className="mt-16">
            <ProcessTimeline steps={INNOVATOR_FOUNDER_TIMELINE} />
          </div>
        </div>
      </section>
    </>
  );
}
