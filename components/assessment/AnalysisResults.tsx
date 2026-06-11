"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import type { AssessmentResult } from "@/lib/assessment";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Shared typography — titles vs description body across all result sections */
const RESULT_TITLE = "text-sm font-semibold leading-snug text-text-primary";
const RESULT_DESCRIPTION =
  "text-sm leading-relaxed text-text-secondary";

const EMBEDDED_TITLE = "text-xs font-semibold leading-snug text-text-primary";
const EMBEDDED_DESCRIPTION =
  "text-xs leading-relaxed text-text-secondary";

type Props = {
  result: AssessmentResult;
  className?: string;
  /** Hide footer disclaimer (product demo embed) */
  hideDisclaimer?: boolean;
  /** Fill a fixed-height frame — same layout, readable compact sizing */
  embedded?: boolean;
};

function scoreTone(score: number) {
  if (score >= 75) return "ready" as const;
  if (score >= 55) return "progress" as const;
  return "early" as const;
}

const TONE_STYLES = {
  ready: {
    ring: "stroke-linear-accent",
    glow: "shadow-[0_0_40px_rgba(94,106,210,0.25)]",
    label: "Strong foundation",
    text: "text-linear-accent",
    bg: "bg-linear-accent-muted",
  },
  progress: {
    ring: "stroke-amber-400",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.15)]",
    label: "Building momentum",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  early: {
    ring: "stroke-red-400",
    glow: "shadow-[0_0_40px_rgba(248,113,113,0.12)]",
    label: "Early stage — gaps to close",
    text: "text-red-400",
    bg: "bg-red-500/10",
  },
};

/** Grid-based results dashboard — strengths, gaps, steps, and timeline at a glance */
export function AnalysisResults({
  result,
  className,
  hideDisclaimer = false,
  embedded = false,
}: Props) {
  const animatedScore = useAnimatedNumber(result.score, 1000, true);
  const tone = scoreTone(result.score);
  const styles = TONE_STYLES[tone];
  const highPriorityCount = result.nextSteps.filter(
    (s) => s.priority === "high"
  ).length;
  const titleClass = embedded ? EMBEDDED_TITLE : RESULT_TITLE;
  const bodyClass = embedded ? EMBEDDED_DESCRIPTION : RESULT_DESCRIPTION;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn(
        embedded
          ? "flex h-full min-h-0 flex-col gap-2.5"
          : "space-y-4",
        className
      )}
    >
      <motion.div
        variants={fadeUp}
        className={cn(
          "grid shrink-0 gap-2.5",
          embedded ? "grid-cols-[148px_1fr]" : "gap-4 lg:grid-cols-[220px_1fr]"
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-xl bg-surface-elevated",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
            styles.glow,
            embedded ? "p-3" : "p-5"
          )}
        >
          <ScoreRing score={animatedScore} tone={tone} compact={embedded} />
          <p
            className={cn(
              "uppercase tracking-wider text-text-muted",
              embedded ? "mt-2 text-[9px]" : "mt-3 text-[10px]"
            )}
          >
            Readiness score
          </p>
          <p
            className={cn(
              "font-medium",
              embedded ? "mt-0.5 text-[11px]" : "mt-1 text-xs",
              styles.text
            )}
          >
            {styles.label}
          </p>
        </div>

        <div
          className={cn(
            "rounded-xl bg-surface-elevated shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
            embedded ? "flex min-h-0 flex-col p-3" : "p-5"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-text-muted">
                Assessment complete
              </p>
              <h2
                className={cn(
                  "mt-0.5 font-semibold text-text-primary",
                  embedded ? "text-sm" : "text-lg"
                )}
              >
                {result.route}
              </h2>
              <p className="mt-0.5 text-[11px] text-linear-accent">
                {result.techNationFit}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-linear-accent-muted px-2 py-0.5 text-[9px] font-medium text-linear-accent">
              <Sparkles className="size-2.5" />
              Deep research
            </span>
          </div>

          <p
            className={cn(
              embedded ? "mt-2 line-clamp-2 flex-1" : "mt-4",
              bodyClass
            )}
          >
            {result.summary}
          </p>

          <div
            className={cn(
              "grid grid-cols-3 gap-1.5",
              embedded ? "mt-2" : "mt-4 gap-2"
            )}
          >
            <StatPill
              icon={
                <TrendingUp
                  className={cn(
                    "text-linear-accent",
                    embedded ? "size-3" : "size-3.5"
                  )}
                />
              }
              value={result.strengths.length}
              label="Strengths"
              compact={embedded}
            />
            <StatPill
              icon={
                <Target
                  className={cn(
                    "text-amber-400",
                    embedded ? "size-3" : "size-3.5"
                  )}
                />
              }
              value={result.gaps.length}
              label="Gaps"
              compact={embedded}
            />
            <StatPill
              icon={
                <Flag
                  className={cn(
                    "text-red-400",
                    embedded ? "size-3" : "size-3.5"
                  )}
                />
              }
              value={highPriorityCount}
              label="High priority"
              compact={embedded}
            />
          </div>
        </div>
      </motion.div>

      <div
        className={cn(
          "grid min-h-0 flex-1 gap-2.5",
          embedded ? "grid-cols-2" : "gap-4 lg:grid-cols-2"
        )}
      >
        <CriterionPanel
          title="Strengths"
          icon={
            <CheckCircle2
              className={cn(
                "text-linear-accent",
                embedded ? "size-3" : "size-3.5"
              )}
            />
          }
          items={result.strengths}
          type="strength"
          accentClass="border-linear-accent/30"
          headerBg="bg-linear-accent-muted/50"
          embedded={embedded}
          titleClass={titleClass}
          bodyClass={bodyClass}
        />
        <CriterionPanel
          title="Gaps to address"
          icon={
            <AlertCircle
              className={cn(
                "text-amber-400",
                embedded ? "size-3" : "size-3.5"
              )}
            />
          }
          items={result.gaps}
          type="gap"
          accentClass="border-amber-500/30"
          headerBg="bg-amber-500/[0.06]"
          embedded={embedded}
          titleClass={titleClass}
          bodyClass={bodyClass}
        />
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1 gap-2.5",
          embedded ? "grid-cols-5" : "gap-4 lg:grid-cols-5"
        )}
      >
        <motion.div
          variants={fadeUp}
          className={cn(
            "flex min-h-0 flex-col rounded-xl bg-surface-elevated shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
            embedded ? "col-span-3" : "lg:col-span-3"
          )}
        >
          <PanelHeader
            icon={
              <ArrowRight
                className={cn(
                  "text-linear-accent",
                  embedded ? "size-3" : "size-3.5"
                )}
              />
            }
            title="Next steps"
            subtitle={`${result.nextSteps.length} actions ranked by priority`}
            compact={embedded}
          />
          <ul
            className={cn(
              "grid min-h-0 flex-1 gap-1.5",
              embedded ? "grid-cols-2 p-2.5 pt-0" : "gap-2 p-4 pt-0 sm:grid-cols-2"
            )}
          >
            {result.nextSteps.map((step, i) => (
              <li
                key={`${step.action}-${i}`}
                className={cn(
                  "flex min-h-0 flex-col rounded-lg border border-white/[0.04] bg-surface",
                  embedded ? "px-2.5 py-2" : "px-3 py-2.5"
                )}
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded bg-white/[0.06] font-semibold text-text-muted",
                      embedded ? "size-4 text-[9px]" : "size-5 text-[10px]"
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-0.5 text-[9px] text-text-muted">
                      <Clock className="size-2.5" />
                      {step.timeline}
                    </span>
                    <PriorityBadge priority={step.priority} compact={embedded} />
                  </div>
                </div>
                <p className={cn(bodyClass, embedded && "line-clamp-3")}>
                  {step.action}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className={cn(
            "flex min-h-0 flex-col rounded-xl bg-surface-elevated shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
            embedded ? "col-span-2" : "lg:col-span-2"
          )}
        >
          <PanelHeader
            icon={
              <Calendar
                className={cn(
                  "text-linear-accent",
                  embedded ? "size-3" : "size-3.5"
                )}
              />
            }
            title="Preparation timeline"
            subtitle="5–8 week roadmap"
            compact={embedded}
          />
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col gap-1.5",
              embedded ? "p-2.5 pt-0" : "grid gap-2 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-1"
            )}
          >
            {result.preparationTimeline.map((phase, i) => (
              <div
                key={phase.phase}
                className={cn(
                  "flex min-h-0 flex-1 flex-col rounded-lg border border-white/[0.04] bg-surface",
                  embedded ? "px-2.5 py-2" : "px-3 py-2.5"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-linear-accent-muted text-[8px] font-bold text-linear-accent">
                    {i + 1}
                  </span>
                  <p className={cn(titleClass, "min-w-0 flex-1 truncate")}>
                    {phase.phase}
                  </p>
                  <span className="shrink-0 text-[9px] font-medium text-linear-accent">
                    {phase.duration}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1 pl-6",
                    bodyClass,
                    embedded && "line-clamp-2 flex-1"
                  )}
                >
                  {phase.focus}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {!hideDisclaimer && !embedded && (
        <p className="text-center text-[10px] text-text-muted">
          AI guidance only — final endorsement decisions are made by UK endorsing
          bodies and the Home Office.
        </p>
      )}
    </motion.div>
  );
}

function ScoreRing({
  score,
  tone,
  compact = false,
}: {
  score: number;
  tone: keyof typeof TONE_STYLES;
  compact?: boolean;
}) {
  const radius = compact ? 42 : 54;
  const stroke = compact ? 6 : 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const styles = TONE_STYLES[tone];

  return (
    <div className={cn("relative", compact ? "size-[104px]" : "size-[140px]")}>
      <svg className="size-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          className={styles.ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-bold tabular-nums text-text-primary",
            compact ? "text-2xl" : "text-3xl"
          )}
        >
          {score}
        </span>
        <span className="text-[9px] text-text-muted">/ 100</span>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  value,
  label,
  compact = false,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/[0.04] bg-surface text-center",
        compact ? "px-2 py-1.5" : "px-3 py-2"
      )}
    >
      <div className="flex items-center justify-center gap-1">
        {icon}
        <span
          className={cn(
            "font-semibold tabular-nums text-text-primary",
            compact ? "text-sm" : "text-lg"
          )}
        >
          {value}
        </span>
      </div>
      <p className="mt-0.5 text-[8px] uppercase tracking-wide text-text-muted">
        {label}
      </p>
    </div>
  );
}

function PanelHeader({
  icon,
  title,
  subtitle,
  compact = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-2 border-b border-white/[0.04]",
        compact ? "px-2.5 py-2" : "px-4 py-3"
      )}
    >
      {icon}
      <div>
        <p
          className={cn(
            "font-medium text-text-primary",
            compact ? "text-[11px]" : "text-xs"
          )}
        >
          {title}
        </p>
        <p className="text-[9px] text-text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function CriterionPanel({
  title,
  icon,
  items,
  type,
  accentClass,
  headerBg,
  embedded = false,
  titleClass = RESULT_TITLE,
  bodyClass = RESULT_DESCRIPTION,
}: {
  title: string;
  icon: React.ReactNode;
  items: { criterion: string; detail: string }[];
  type: "strength" | "gap";
  accentClass: string;
  headerBg: string;
  embedded?: boolean;
  titleClass?: string;
  bodyClass?: string;
}) {
  const ItemIcon = type === "strength" ? CheckCircle2 : AlertCircle;
  const iconClass =
    type === "strength" ? "text-linear-accent" : "text-amber-400";

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "rounded-xl border-t-2 bg-surface-elevated shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        accentClass,
        embedded && "flex min-h-0 flex-col"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-b border-white/[0.04]",
          headerBg,
          embedded ? "px-2.5 py-2" : "px-4 py-3"
        )}
      >
        {icon}
        <div>
          <p
            className={cn(
              "font-medium text-text-primary",
              embedded ? "text-[11px]" : "text-xs"
            )}
          >
            {title}
          </p>
          <p className="text-[9px] text-text-muted">
            {items.length} identified
          </p>
        </div>
      </div>
      <ul
        className={cn(
          embedded
            ? "flex min-h-0 flex-1 flex-col gap-1.5 p-2"
            : "space-y-2 p-3"
        )}
      >
        {items.map((item) => (
          <li
            key={item.criterion}
            className={cn(
              "rounded-lg border border-white/[0.04] bg-surface",
              embedded
                ? "flex min-h-0 flex-1 flex-col px-2.5 py-2"
                : "px-4 py-3"
            )}
          >
            <div className="flex min-h-0 flex-1 items-start gap-2">
              <ItemIcon
                className={cn(
                  "mt-0.5 shrink-0",
                  iconClass,
                  embedded ? "size-3.5" : "size-4"
                )}
              />
              <div className="min-w-0">
                <p className={titleClass}>{item.criterion}</p>
                <p
                  className={cn(
                    embedded ? "mt-1 line-clamp-3" : "mt-1.5",
                    bodyClass
                  )}
                >
                  {item.detail}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function PriorityBadge({
  priority,
  compact = false,
}: {
  priority: "high" | "medium" | "low";
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded font-semibold uppercase tracking-wide",
        compact ? "px-1 py-px text-[7px]" : "px-1.5 py-0.5 text-[8px]",
        priority === "high"
          ? "bg-red-500/15 text-red-400"
          : priority === "medium"
            ? "bg-amber-500/15 text-amber-400"
            : "bg-white/[0.06] text-text-muted"
      )}
    >
      {priority}
    </span>
  );
}
