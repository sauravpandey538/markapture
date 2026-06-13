"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStep = {
  id: string;
  title: string;
  description: string;
  /** Shown under the active step only — unique per step */
  detail?: string;
};

type Props = {
  title: string;
  subtitle: string;
  badge: string;
  steps: TimelineStep[];
  /** ms per step advance */
  stepDuration?: number;
  footer?: string;
  /** Tighter layout for product demo frames */
  compact?: boolean;
  /** Fill parent height — prevents layout jump in fixed demo frames */
  fillHeight?: boolean;
  /** Fired after every step has completed (incl. brief 100% pause) */
  onComplete?: () => void;
  /** ms to hold at 100% before onComplete — demo transitions */
  completeHoldMs?: number;
  /** Hold the final step until externalReady (e.g. API response) before marking complete */
  waitForExternal?: boolean;
  externalReady?: boolean;
};

/** Vertical timeline loader — connector lines align through icon centres */
export function TimelineLoader({
  title,
  subtitle,
  badge,
  steps,
  stepDuration = 2800,
  footer,
  compact = false,
  fillHeight = false,
  onComplete,
  completeHoldMs = 450,
  waitForExternal = false,
  externalReady = false,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [allComplete, setAllComplete] = useState(false);

  const progress = allComplete
    ? 100
    : activeIndex === steps.length - 1
      ? Math.min(88 + activeIndex * 2, 92)
      : ((activeIndex + 1) / steps.length) * 100;

  useEffect(() => {
    setActiveIndex(0);
    setAllComplete(false);
  }, [steps, stepDuration]);

  useEffect(() => {
    if (allComplete) return;

    const timer = setInterval(() => {
      setActiveIndex((i) => Math.min(i + 1, steps.length - 1));
    }, stepDuration);
    return () => clearInterval(timer);
  }, [stepDuration, steps.length, allComplete]);

  // After the final step runs, mark every step done — only when external signal received if waitForExternal
  useEffect(() => {
    if (allComplete || activeIndex !== steps.length - 1) return;
    if (waitForExternal && !externalReady) return;

    const holdMs =
      waitForExternal && externalReady ? Math.min(stepDuration, 600) : stepDuration;

    const finish = setTimeout(() => {
      setAllComplete(true);
    }, holdMs);

    return () => clearTimeout(finish);
  }, [
    activeIndex,
    allComplete,
    stepDuration,
    steps.length,
    waitForExternal,
    externalReady,
  ]);

  useEffect(() => {
    if (!allComplete || !onComplete) return;

    const hold = setTimeout(onComplete, completeHoldMs);
    return () => clearTimeout(hold);
  }, [allComplete, onComplete, completeHoldMs]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-surface-elevated shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        fillHeight && "flex h-full min-h-0 flex-col"
      )}
    >
      <div
        className={cn(
          "shrink-0 border-b border-white/[0.06]",
          compact ? "p-4" : "p-6"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              {subtitle}
            </p>
            <h2
              className={cn(
                "mt-1 font-semibold text-text-primary",
                compact ? "truncate text-base" : "text-xl"
              )}
            >
              {title}
            </h2>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-linear-accent-muted px-2.5 py-1 text-[10px] font-medium text-linear-accent">
            {allComplete ? (
              <CheckCircle2 className="size-3" />
            ) : (
              <Loader2 className="size-3 animate-spin" />
            )}
            {allComplete ? "Complete" : badge}
          </span>
        </div>

        <div className={compact ? "mt-3" : "mt-5"}>
          <div className="mb-2 flex items-center justify-between text-[11px] text-text-muted">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-linear-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          compact ? "p-4" : "p-6",
          fillHeight && "flex min-h-0 flex-1 flex-col justify-center"
        )}
      >
        <ol className="space-y-0">
          {steps.map((step, i) => {
            const done = allComplete || i < activeIndex;
            const active = !allComplete && i === activeIndex;
            const pending = !allComplete && i > activeIndex;
            const isLast = i === steps.length - 1;

            const rowPb = !isLast && (compact ? (fillHeight ? "pb-3" : "pb-4") : "pb-8");
            const connectorH = compact
              ? fillHeight
                ? "min-h-[1rem]"
                : "min-h-[1.25rem]"
              : "min-h-[2.5rem]";

            return (
              <li
                key={step.id}
                className={cn(
                  "flex",
                  compact ? "gap-3" : "gap-4",
                  fillHeight && compact && "min-h-[5.5rem]"
                )}
              >
                {/* Icon column — connector segment centred on each circle */}
                <div
                  className={cn(
                    "flex shrink-0 flex-col items-center",
                    compact ? "w-7" : "w-9"
                  )}
                >
                  <div
                    className={cn(
                      "relative z-10 flex items-center justify-center rounded-full transition-all duration-500",
                      compact ? "size-7" : "size-9",
                      done && "bg-linear-accent text-white",
                      active &&
                        "bg-linear-accent-muted shadow-[0_0_24px_rgba(94,106,210,0.35)]",
                      pending && "bg-surface border border-white/[0.08]"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="size-4 text-white" />
                    ) : active ? (
                      <Loader2 className="size-4 animate-spin text-linear-accent" />
                    ) : (
                      <Circle className="size-3 text-text-muted" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "my-1 w-px flex-1 rounded-full transition-colors duration-500",
                        connectorH,
                        done ? "bg-linear-accent/55" : "bg-white/[0.08]"
                      )}
                      aria-hidden
                    />
                  )}
                </div>

                <div className={cn("min-w-0 flex-1", rowPb)}>
                  <p
                    className={cn(
                      "font-medium transition-colors",
                      compact ? "text-xs" : "text-sm",
                      active
                        ? "text-text-primary"
                        : done
                          ? "text-text-secondary"
                          : "text-text-muted"
                    )}
                  >
                    {step.title}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 leading-relaxed transition-colors",
                      compact ? "text-[10px]" : "text-xs",
                      active ? "text-text-secondary" : "text-text-muted"
                    )}
                  >
                    {step.description}
                  </p>

                  {/* Reserved slot — avoids height jump when detail appears */}
                  <div
                    className={cn(
                      compact && fillHeight ? "mt-2 h-9" : compact ? "mt-2 min-h-9" : "mt-3 min-h-0"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {active && step.detail && (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "rounded-lg border border-linear-accent/20 bg-linear-accent-muted/30",
                            compact ? "px-2 py-1.5" : "px-3 py-2"
                          )}
                        >
                          <p
                            className={cn(
                              "line-clamp-2 text-linear-accent",
                              compact ? "text-[10px]" : "text-[11px]"
                            )}
                          >
                            {step.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {footer && (
        <p
          className={cn(
            "shrink-0 border-t border-white/[0.06] text-center text-text-muted",
            compact ? "px-4 py-2.5 text-[10px]" : "px-6 py-4 text-xs"
          )}
        >
          {footer}
        </p>
      )}
    </div>
  );
}
