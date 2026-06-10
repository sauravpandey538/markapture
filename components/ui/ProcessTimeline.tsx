import { cn } from "@/lib/utils";
import type { TimelineStep } from "@/lib/timelines";

type ProcessTimelineProps = {
  steps: TimelineStep[];
  className?: string;
};

/**
 * Vertical preparation timeline — connected steps with duration,
 * description, and deliverables so the process feels real, not placeholder.
 */
export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-linear-accent/60 via-linear-accent/20 to-transparent"
        aria-hidden
      />
      <ol className="space-y-0">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="group relative grid gap-4 pb-12 pl-12 last:pb-0 lg:grid-cols-[1fr_280px]"
          >
            {/* Node */}
            <div
              className="absolute left-0 top-1 flex size-8 items-center justify-center rounded-full bg-linear-accent-muted ring-4 ring-bg transition-all group-hover:bg-linear-accent group-hover:shadow-[0_0_20px_rgba(94,106,210,0.4)]"
              aria-hidden
            >
              <span className="text-xs font-semibold text-linear-accent transition-colors group-hover:text-white">
                {index + 1}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-medium text-text-primary">
                  {step.title}
                </h3>
                <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 text-[11px] font-medium text-text-muted">
                  {step.duration}
                </span>
              </div>
              <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
                {step.description}
              </p>
              <ul className="mt-4 space-y-2">
                {step.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-linear-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual accent card — varies layout per step */}
            <div
              className={cn(
                "hidden rounded-xl bg-surface-elevated/80 p-5 lg:block",
                index % 2 === 0 && "lg:mt-2"
              )}
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                You leave with
              </p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {step.deliverables[0]}
              </p>
              {step.deliverables[1] && (
                <p className="mt-1 text-xs text-text-muted">
                  + {step.deliverables.length - 1} more deliverables
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
