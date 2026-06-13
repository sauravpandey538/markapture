"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Flag,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import {
  RISK_BAND_LABELS,
  type EvidenceReviewResult,
} from "@/lib/evidence-review";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  result: EvidenceReviewResult;
  onStartNew: () => void;
  /** ps | lor — adjusts rubric panel labels for application documents */
  documentType?: "ps" | "lor" | "evidence";
};

const STRENGTH_STYLES = {
  strong: { label: "Strong", className: "text-linear-accent bg-linear-accent-muted" },
  partial: { label: "Partial", className: "text-amber-400 bg-amber-500/10" },
  weak: { label: "Weak", className: "text-red-400 bg-red-500/10" },
  not_assessable: {
    label: "Not assessable",
    className: "text-text-muted bg-white/[0.06]",
  },
} as const;

const STATUS_STYLES = {
  met: { icon: CheckCircle2, className: "text-linear-accent" },
  partial: { icon: AlertTriangle, className: "text-amber-400" },
  weak: { icon: AlertCircle, className: "text-red-400" },
  missing: { icon: XCircle, className: "text-text-muted" },
} as const;

const RISK_TONE = {
  red: "text-red-400 bg-red-500/10 border-red-500/30",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  blue: "text-linear-accent bg-linear-accent-muted border-linear-accent/30",
  green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
} as const;

/** Criterion-specific evidence review results dashboard */
export function EvidenceReviewResults({
  result,
  onStartNew,
  documentType = "evidence",
}: Props) {
  const animatedScore = useAnimatedNumber(result.score, 1000, true);
  const risk = RISK_BAND_LABELS[result.riskBand];

  const mappingTitle =
    documentType === "ps"
      ? "Statement rubric"
      : documentType === "lor"
        ? "Letter rubric"
        : "Mandatory criteria mapping";

  const mappingSubtitle =
    documentType === "ps"
      ? "How your personal statement maps to Tech Nation expectations"
      : documentType === "lor"
        ? "How this letter meets Tech Nation reference standards"
        : "How this evidence supports Tech Nation requirements";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-xl bg-surface-elevated p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
          <div className="relative size-[120px]">
            <svg className="size-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                className="stroke-linear-accent"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={
                  2 * Math.PI * 48 - (animatedScore / 100) * 2 * Math.PI * 48
                }
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums text-text-primary">
                {animatedScore}
              </span>
              <span className="text-[10px] text-text-muted">/ 100</span>
            </div>
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-wider text-text-muted">
            Evidence score
          </p>
        </div>

        <div className="rounded-xl bg-surface-elevated p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted">
                Evidence review complete
              </p>
              <h2 className="mt-1 text-lg font-semibold text-text-primary">
                {result.criterion}
              </h2>
              {result.track && (
                <p className="mt-0.5 text-xs text-linear-accent">
                  {result.track}
                </p>
              )}
              <p className="mt-1 text-xs text-text-secondary">
                {result.positioning}
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-linear-accent-muted px-2.5 py-1 text-[10px] font-medium text-linear-accent">
              <Sparkles className="size-3" />
              Deep research
            </span>
          </div>

          <div
            className={cn(
              "mt-4 rounded-lg border px-3 py-2.5",
              RISK_TONE[risk.tone]
            )}
          >
            <p className="text-sm font-semibold">{risk.label}</p>
            <p className="mt-1 text-xs leading-relaxed opacity-90">
              {result.riskSummary}
            </p>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {result.summary}
          </p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Evidence assessments"
          subtitle={`${result.evidenceAssessments.length} documents reviewed`}
          icon={<Target className="size-3.5 text-linear-accent" />}
        >
          <ul className="space-y-2 p-4 pt-0">
            {result.evidenceAssessments.map((item) => {
              const style = STRENGTH_STYLES[item.strength];
              return (
                <li
                  key={`${item.fileName}-${item.evidenceType}`}
                  className="rounded-lg border border-white/[0.04] bg-surface px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-text-primary">
                      {item.evidenceType}
                    </p>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[9px] font-semibold uppercase",
                        style.className
                      )}
                    >
                      {style.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-text-muted">
                    {item.fileName}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.detail}
                  </p>
                  <p className="mt-2 text-xs text-linear-accent/80">
                    Endorser signal: {item.endorserSignal}
                  </p>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel
          title={mappingTitle}
          subtitle={mappingSubtitle}
          icon={<Flag className="size-3.5 text-amber-400" />}
        >
          <ul className="space-y-2 p-4 pt-0">
            {result.mandatoryMapping.map((item) => {
              const style = STATUS_STYLES[item.status];
              const Icon = style.icon;
              return (
                <li
                  key={item.criterion}
                  className="rounded-lg border border-white/[0.04] bg-surface px-4 py-3"
                >
                  <div className="flex items-start gap-2">
                    <Icon
                      className={cn("mt-0.5 size-4 shrink-0", style.className)}
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {item.criterion}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Gaps"
          subtitle={`${result.gaps.length} issues identified`}
          icon={<AlertCircle className="size-3.5 text-red-400" />}
        >
          <ul className="space-y-2 p-4 pt-0">
            {result.gaps.map((gap) => (
              <li
                key={gap.area}
                className="rounded-lg border border-white/[0.04] bg-surface px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-text-primary">
                    {gap.area}
                  </p>
                  <SeverityBadge severity={gap.severity} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  {gap.detail}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Recommendations"
          subtitle="Prioritised actions to reduce rejection risk"
          icon={<ArrowRight className="size-3.5 text-linear-accent" />}
        >
          <ul className="space-y-2 p-4 pt-0">
            {result.recommendations.map((rec, i) => (
              <li
                key={`${rec.action}-${i}`}
                className="rounded-lg border border-white/[0.04] bg-surface px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex size-5 items-center justify-center rounded bg-white/[0.06] text-[10px] font-semibold text-text-muted">
                    {i + 1}
                  </span>
                  <PriorityBadge priority={rec.priority} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {rec.action}
                </p>
                <p className="mt-1 text-[11px] text-text-muted">
                  {rec.timeline}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
        <p className="text-[10px] text-text-muted">
          AI guidance only — final endorsement decisions are made by Tech Nation
          and the Home Office.
        </p>
        <button
          type="button"
          onClick={onStartNew}
          className="text-sm text-text-secondary underline hover:text-text-primary"
        >
          Review another criterion
        </button>
      </div>
    </motion.div>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl bg-surface-elevated shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
    >
      <div className="flex items-center gap-2 border-b border-white/[0.04] px-4 py-3">
        {icon}
        <div>
          <p className="text-xs font-medium text-text-primary">{title}</p>
          <p className="text-[10px] text-text-muted">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function SeverityBadge({
  severity,
}: {
  severity: "critical" | "major" | "minor";
}) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[8px] font-semibold uppercase",
        severity === "critical"
          ? "bg-red-500/15 text-red-400"
          : severity === "major"
            ? "bg-amber-500/15 text-amber-400"
            : "bg-white/[0.06] text-text-muted"
      )}
    >
      {severity}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: "high" | "medium" | "low";
}) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[8px] font-semibold uppercase",
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
