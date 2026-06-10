import { CTAButton } from "@/components/ui/CTAButton";

type EndorsementCtaProps = {
  className?: string;
};

/** Bottom-of-story CTA — accent glow, clear hierarchy, horizontal on desktop */
export function EndorsementCta({ className }: EndorsementCtaProps) {
  return (
    <section
      className={`relative mt-20 overflow-hidden rounded-2xl ${className ?? ""}`}
    >
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-linear-accent/20 via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative rounded-2xl bg-surface px-8 py-10 shadow-[0_0_0_1px_rgba(94,106,210,0.25),0_8px_40px_rgba(0,0,0,0.35)] md:px-12 md:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-wider text-linear-accent">
              Next step
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
              Ready to start your endorsement preparation?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              Book a free 30-minute consultation with Nabila Farzin. You&apos;ll
              leave with a recommended route and a preparation timeline tailored
              to your background.
            </p>
          </div>
          <CTAButton
            href="/book-consultation"
            className="w-full shrink-0 px-6 py-2.5 sm:w-auto"
          >
            Book free consultation
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
