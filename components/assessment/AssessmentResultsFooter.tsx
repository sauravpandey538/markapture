"use client";

import {
  ArrowRight,
  Calendar,
  MessageCircle,
  RotateCcw,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import type { AssessmentResult } from "@/lib/assessment";
import { cn } from "@/lib/utils";

type Props = {
  result: AssessmentResult;
  onStartNew: () => void;
};

function getCtaCopy(score: number, highPriorityCount: number) {
  if (score >= 75) {
    return {
      eyebrow: "You're on track",
      title: "Turn this score into an endorsement-ready application",
      description:
        highPriorityCount > 0
          ? `Your assessment flagged ${highPriorityCount} high-priority gap${highPriorityCount === 1 ? "" : "s"}. A 1:1 session helps you close them with a structured preparation plan.`
          : "Fine-tune your evidence, referees, and UK contribution plan with guidance from a Tech Nation alumni.",
    };
  }

  if (score >= 55) {
    return {
      eyebrow: "Strong foundation",
      title: "Get a clear roadmap for your endorsement",
      description:
        highPriorityCount > 0
          ? `We'll walk through your ${highPriorityCount} urgent next step${highPriorityCount === 1 ? "" : "s"} and map a realistic timeline to submission.`
          : "Book a free consultation to prioritise gaps, evidence, and your UK plan with an endorsement specialist.",
    };
  }

  return {
    eyebrow: "Recommended next step",
    title: "Don't navigate endorsement gaps alone",
    description:
      highPriorityCount > 0
        ? `With ${highPriorityCount} high-priority item${highPriorityCount === 1 ? "" : "s"} to address, a 1:1 session gives you clarity on what to fix first — and how.`
        : "A free consultation turns this assessment into a practical week-by-week preparation plan tailored to your profile.",
  };
}

const PERKS = [
  { icon: Calendar, label: "Free 30-minute call" },
  { icon: UserCheck, label: "Tech Nation alumni guidance" },
  { icon: MessageCircle, label: "Tailored to your gaps" },
] as const;

/** Post-results CTA — consultation upsell + start new assessment */
export function AssessmentResultsFooter({ result, onStartNew }: Props) {
  const highPriorityCount = result.nextSteps.filter(
    (s) => s.priority === "high"
  ).length;
  const copy = getCtaCopy(result.score, highPriorityCount);

  return (
    <section className="relative mt-8 overflow-hidden rounded-2xl">
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-linear-accent/25 via-linear-accent/5 to-transparent"
        aria-hidden
      />
      <div
        className={cn(
          "relative rounded-2xl bg-surface-elevated p-6 md:p-8",
          "shadow-[inset_0_0_0_1px_rgba(94,106,210,0.3),0_12px_48px_rgba(0,0,0,0.35)]"
        )}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-linear-accent">
              <Sparkles className="size-3.5" />
              {copy.eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-text-primary md:text-2xl">
              {copy.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
              {copy.description}
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {PERKS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-text-secondary"
                >
                  <Icon className="size-3.5 shrink-0 text-linear-accent" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:min-w-[220px]">
            <CTAButton
              href="/book-consultation"
              className="inline-flex w-full items-center justify-center gap-2 px-6 py-2.5 sm:w-auto"
            >
              Book free consultation
              <ArrowRight className="size-4" />
            </CTAButton>
            <CTAButton
              type="button"
              variant="secondary"
              onClick={onStartNew}
              className="inline-flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <RotateCcw className="size-3.5" />
              Start new assessment
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
