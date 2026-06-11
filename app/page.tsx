import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { EndorsementCompareMock } from "@/components/product/EndorsementCompareMock";
import { ResumeScannerMock } from "@/components/product/ResumeScannerMock";
import { CvBuilderMock } from "@/components/product/CvBuilderMock";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { CUSTOMER_STORIES } from "@/lib/constants";
import { GLOBAL_TALENT_TIMELINE } from "@/lib/timelines";

export const metadata: Metadata = {
  title: "Markapture | UK Endorsement Preparation",
  description:
    "Structured guidance for Global Talent and Innovator Founder visa endorsements. Route finder, CV review, and expert consultation.",
};

const featured = CUSTOMER_STORIES.filter((s) => s.featured);

export default function HomePage() {
  return (
    <>
      {/* Hero — copy + full-width comparison demo */}
      <section className="relative overflow-hidden">
        <div className="glow-orb glow-orb-purple -right-40 top-0 size-[600px]" aria-hidden />
        <div className="page-container pb-10 pt-20 md:pb-14 md:pt-28">
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              UK endorsement preparation
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tightest text-text-primary md:text-6xl md:leading-[1.08]">
              Endorsement preparation,
              <br />
              <span className="text-text-secondary">built for clarity</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
              Global Talent and Innovator Founder routes — eligibility
              assessment, CV review, and step-by-step guidance from a Tech
              Nation alumni. No visa guarantees, just structured preparation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="/book-consultation">Book free consultation</CTAButton>
              <CTAButton
                href="/global-talent/assessment"
                variant="secondary"
                className="group inline-flex items-center gap-2 border-linear-accent/30 bg-linear-accent-muted/40 shadow-[0_0_24px_rgba(94,106,210,0.12)] hover:border-linear-accent/50 hover:bg-linear-accent-muted/60"
              >
                <Sparkles className="size-4 text-linear-accent transition-transform group-hover:scale-110" />
                Free GTV Assessment
                <ArrowRight className="size-3.5 text-linear-accent transition-transform group-hover:translate-x-0.5" />
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Full-width endorsement comparison */}
        <div className="w-full px-4 pb-16 sm:px-5 md:pb-24">
          <div className="mx-auto w-full max-w-[1400px]">
            <EndorsementCompareMock />
          </div>
        </div>
      </section>

      {/* Route finder — resume scanner */}
      <section className="section-band py-24 md:py-32">
        <div className="page-container grid items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeader
              eyebrow="Route finder"
              title="Know your route before you file"
              description="Global Talent and Innovator Founder require different evidence. Our workflow scores both routes and surfaces gaps before you invest months in the wrong path."
            />
            <Link
              href="/global-talent"
              className="mt-8 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-linear-accent"
            >
              Explore Global Talent
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ResumeScannerMock />
        </div>
      </section>

      {/* CV builder — form fill → 3-page resume */}
      <section className="py-24 md:py-32">
        <div className="grid lg:grid-cols-2 lg:gap-0">
          <div className="page-container py-0 lg:pr-12 lg:pl-[max(1rem,calc((100vw-1280px)/2+1rem))]">
            <CvBuilderMock />
          </div>
          <div className="page-container flex items-center py-16 lg:py-0 lg:pl-12">
            <div>
              <SectionHeader
                eyebrow="CV review"
                title="Evidence that endorsers actually expect"
                description="Share your career background once — we structure it into a Harvard-style CV scored against endorser rubrics for leadership, innovation, and UK relevance."
              />
              <Link
                href="/innovator-founder"
                className="mt-8 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-linear-accent"
              >
                Explore Innovator Founder
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process preview */}
      <section className="section-elevated py-24 md:py-32">
        <div className="page-container">
          <SectionHeader
            eyebrow="The process"
            title="From first call to endorsement-ready"
            description="Every step has a deliverable. You always know what's next and what you're working toward."
          />
          <div className="mt-16">
            <ProcessTimeline steps={GLOBAL_TALENT_TIMELINE.slice(0, 3)} />
          </div>
          <Link
            href="/global-talent"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-linear-accent hover:underline"
          >
            See full Global Talent timeline
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Customers */}
      <section className="py-24 md:py-32">
        <div className="page-container">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Customers"
              title="Stories from professionals like you"
              description="Real preparation journeys — outcomes vary and visa approval is never guaranteed."
            />
            <Link
              href="/customers"
              className="inline-flex shrink-0 items-center gap-1 text-sm text-text-secondary hover:text-linear-accent"
            >
              View all stories
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((story) => (
              <CustomerCard key={story.slug} {...story} featured />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="glow-orb glow-orb-purple -left-20 top-1/2 size-[400px]" aria-hidden />
        <div className="page-container relative">
          <SectionHeader
            title="Built for your endorsement. Available today."
            description="Book a free 30-minute consultation with Nabila Farzin, Tech Nation alumni. Walk away with a recommended route and a clear next step."
          />
          <div className="mt-8">
            <CTAButton href="/book-consultation">Book free consultation</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
