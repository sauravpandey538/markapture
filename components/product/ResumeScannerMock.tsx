"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ScanLine,
} from "lucide-react";
import { ProductFrame } from "@/components/product/ProductFrame";
import { ResumeDocument } from "@/components/product/ResumeDocument";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { SCAN_PROFILES } from "@/lib/product-demos";
import { cn } from "@/lib/utils";

type Phase = "scan" | "results";

const SCAN_MS = 3000;
const RESULTS_MS = 6500;
/** Tall enough to show full resume + results without internal scroll */
const PANEL_H = "h-[700px]";

export function ResumeScannerMock({ title = "markapture — route finder" }: { title?: string }) {
  const [profileIndex, setProfileIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("scan");
  const [scanProgress, setScanProgress] = useState(0);

  const profile = SCAN_PROFILES[profileIndex];
  const animatedScore = useAnimatedNumber(profile.score, 900, phase === "results");

  useEffect(() => {
    if (phase !== "scan") return;

    const start = Date.now();
    const tick = setInterval(() => {
      setScanProgress(Math.min(((Date.now() - start) / SCAN_MS) * 100, 100));
    }, 40);

    const next = setTimeout(() => {
      setPhase("results");
      setScanProgress(100);
    }, SCAN_MS);

    return () => {
      clearInterval(tick);
      clearTimeout(next);
    };
  }, [phase, profileIndex]);

  useEffect(() => {
    if (phase !== "results") return;

    const next = setTimeout(() => {
      setProfileIndex((i) => (i + 1) % SCAN_PROFILES.length);
      setPhase("scan");
      setScanProgress(0);
    }, RESULTS_MS);

    return () => clearTimeout(next);
  }, [phase, profileIndex]);

  return (
    <ProductFrame title={title}>
      <div className={cn("grid md:grid-cols-[1.2fr_0.8fr]", PANEL_H)}>
        <div className={cn("flex flex-col border-b border-white/[0.06] p-3 md:border-b-0 md:border-r", PANEL_H)}>
          <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              Uploaded CV · {profile.techNationFit}
            </p>
            {phase === "scan" && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-linear-accent-muted px-2 py-0.5 text-[9px] text-linear-accent">
                <Loader2 className="size-2.5 animate-spin" />
                Scanning
              </span>
            )}
          </div>

          <div className="resume-scanner-viewport relative min-h-0 flex-1">
            <div
              className={cn(
                "resume-scanner-paper relative",
                phase === "scan" && "is-scanning"
              )}
            >
              <ResumeDocument profile={profile} variant="scanner" />

              {phase === "scan" && (
                <div className="resume-scanner-scan-overlay pointer-events-none absolute inset-0 rounded-sm">
                  <span className="resume-scanner-corner resume-scanner-corner-tl" />
                  <span className="resume-scanner-corner resume-scanner-corner-tr" />
                  <span className="resume-scanner-corner resume-scanner-corner-bl" />
                  <span className="resume-scanner-corner resume-scanner-corner-br" />
                  <div
                    className="resume-scanner-beam absolute inset-x-0"
                    style={{ top: `${scanProgress}%` }}
                  />
                  <div
                    className="absolute inset-x-0 h-8 bg-gradient-to-b from-linear-accent/20 to-transparent"
                    style={{ top: `${Math.max(scanProgress - 4, 0)}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 h-8 shrink-0">
            <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-linear-accent transition-[width] duration-150 ease-linear"
                style={{ width: `${phase === "scan" ? scanProgress : 100}%` }}
              />
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-[9px] text-text-muted">
              <ScanLine className="size-2.5" />
              {phase === "scan"
                ? "Mapping to Tech Nation Digital Technology criteria…"
                : "Scan complete — results ready"}
            </p>
          </div>
        </div>

        <div className={cn("flex flex-col overflow-hidden p-4", PANEL_H)}>
          <div className="flex min-h-0 flex-1 flex-col justify-start">
            {phase === "scan" ? (
              <ScanningPanel progress={scanProgress} profile={profile} />
            ) : (
              <ResultsContent profile={profile} score={animatedScore} />
            )}
          </div>
        </div>
      </div>
    </ProductFrame>
  );
}

const SCAN_CRITERIA = [
  "Innovation in digital technology",
  "Recognition beyond occupation",
  "Significant technical contribution",
  "UK contribution plan",
] as const;

function ScanningPanel({
  progress,
  profile,
}: {
  progress: number;
  profile: (typeof SCAN_PROFILES)[number];
}) {
  const activeCriterion = Math.min(
    Math.floor((progress / 100) * SCAN_CRITERIA.length),
    SCAN_CRITERIA.length - 1
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">
            Analysing CV
          </p>
          <p className="mt-1 text-sm font-medium text-text-primary">
            Scanning for {profile.route} fit…
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-linear-accent-muted px-2 py-0.5 text-[9px] text-linear-accent">
          <Loader2 className="size-2.5 animate-spin" />
          {Math.round(progress)}%
        </span>
      </div>

      <ul className="space-y-2">
        {SCAN_CRITERIA.map((criterion, i) => {
          const isActive = i === activeCriterion;
          const isDone = i < activeCriterion;

          return (
            <li
              key={criterion}
              className={cn(
                "rounded-md border px-3 py-2.5 transition-colors duration-300",
                isActive
                  ? "border-linear-accent/40 bg-linear-accent-muted"
                  : isDone
                    ? "border-white/[0.04] bg-surface-elevated/60 opacity-70"
                    : "border-transparent bg-surface-elevated"
              )}
            >
              <div className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2 className="size-3 shrink-0 text-linear-accent" />
                ) : isActive ? (
                  <Loader2 className="size-3 shrink-0 animate-spin text-linear-accent" />
                ) : (
                  <ScanLine className="size-3 shrink-0 text-text-muted" />
                )}
                <p className="text-[10px] text-text-secondary">{criterion}</p>
              </div>
              {isActive && (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-linear-accent transition-[width] duration-150 ease-linear"
                    style={{
                      width: `${((progress % 25) / 25) * 100 || 8}%`,
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto space-y-2 pt-4">
        <SkeletonBlock title="Strengths" count={profile.strengths.length} />
        <SkeletonBlock title="Gaps to address" count={profile.weaknesses.length} />
      </div>
    </div>
  );
}

function SkeletonBlock({
  title,
  count,
  showPriority,
}: {
  title: string;
  count: number;
  showPriority?: boolean;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
        {title}
      </p>
      <ul className="space-y-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <li
            key={`${title}-${i}`}
            className="rounded-md bg-surface-elevated px-2.5 py-2.5"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="h-2.5 w-3/4 skeleton-line" style={{ animationDelay: `${i * 80}ms` }} />
            <div
              className="mt-2 h-2 w-full skeleton-line"
              style={{ animationDelay: `${i * 80 + 60}ms` }}
            />
            {showPriority && (
              <div className="mt-2 h-3 w-12 skeleton-line" style={{ animationDelay: `${i * 80 + 120}ms` }} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultsContent({
  profile,
  score,
}: {
  profile: (typeof SCAN_PROFILES)[number];
  score: number;
}) {
  return (
    <div className="space-y-3">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">
            Tech Nation fit score
          </p>
          <p className="text-2xl font-semibold text-text-primary">
            {score}
            <span className="text-sm text-text-muted">/100</span>
          </p>
        </div>
        <span className="rounded bg-linear-accent-muted px-2 py-0.5 text-[10px] font-medium text-linear-accent">
          {profile.route}
        </span>
      </div>

      <CriterionBlock title="Strengths" items={profile.strengths} type="strength" />
      <CriterionBlock title="Gaps to address" items={profile.weaknesses} type="weakness" />
      <NextStepsBlock items={profile.nextSteps} />
    </div>
  );
}

function CriterionBlock({
  title,
  items,
  type,
}: {
  title: string;
  items: { criterion: string; detail: string }[];
  type: "strength" | "weakness";
}) {
  const Icon = type === "strength" ? CheckCircle2 : AlertCircle;
  const iconClass = type === "strength" ? "text-linear-accent" : "text-amber-400";

  return (
    <div>
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.criterion} className="rounded-md bg-surface-elevated px-2.5 py-2">
            <div className="flex items-start gap-2">
              <Icon className={cn("mt-0.5 size-3 shrink-0", iconClass)} />
              <div>
                <p className="text-[10px] font-medium text-text-primary">{item.criterion}</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-text-muted">{item.detail}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NextStepsBlock({
  items,
}: {
  items: { action: string; priority: "high" | "medium" }[];
}) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
        Next steps
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.action}
            className="flex items-start gap-2 rounded-md bg-surface-elevated px-2.5 py-2"
          >
            <ArrowRight className="mt-0.5 size-3 shrink-0 text-linear-accent" />
            <div className="flex-1">
              <p className="text-[10px] leading-relaxed text-text-secondary">{item.action}</p>
              <span
                className={cn(
                  "mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-medium uppercase",
                  item.priority === "high"
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-white/[0.06] text-text-muted"
                )}
              >
                {item.priority}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
