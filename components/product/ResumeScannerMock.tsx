"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  ScanLine,
  Upload,
} from "lucide-react";
import { AnalysisResults } from "@/components/assessment/AnalysisResults";
import { TimelineLoader } from "@/components/assessment/TimelineLoader";
import { ProductFrame } from "@/components/product/ProductFrame";
import { ResumeDocument } from "@/components/product/ResumeDocument";
import { useDemoInView } from "@/hooks/useDemoInView";
import {
  SCAN_PROFILES,
  scanProfileToAssessmentResult,
} from "@/lib/product-demos";
import { cn } from "@/lib/utils";

type Phase = "scan" | "analyzing" | "results";

/** Single fixed height for every phase — no layout jump */
const FRAME_HEIGHT_PX = 720;

const SCAN_MS = 3200;
const DEMO_STEP_MS = 1100;
const RESULTS_MS = 10000;

/** Same steps as live AnalysisLoading — trimmed for demo timing */
const DEMO_LOADER_STEPS = [
  {
    id: "merge",
    title: "Combining CV + your answers",
    description:
      "Merging resume data with your targeted responses — no duplicate inputs.",
    detail: "Stage 1 endorsement inputs: CV and recommendation letters.",
  },
  {
    id: "criteria",
    title: "Scoring against endorser criteria",
    description: "Mapping strengths and gaps to Tech Nation rubric.",
    detail: "Innovation · Recognition · Contribution · UK plan",
  },
  {
    id: "strengths",
    title: "Identifying strengths & gaps",
    description:
      "Highlighting what's endorsement-ready and what needs work.",
    detail: "Exceptional Talent vs Exceptional Promise positioning.",
  },
  {
    id: "timeline",
    title: "Building your preparation plan",
    description:
      "Creating prioritised next steps and a week-by-week timeline.",
    detail: "Prioritising referee outreach and UK plan drafting.",
  },
] as const;

const phaseMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export function ResumeScannerMock({
  title = "markapture — route finder",
}: {
  title?: string;
}) {
  const { ref, isInView } = useDemoInView();
  const [profileIndex, setProfileIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("scan");
  const [scanProgress, setScanProgress] = useState(0);

  const profile = SCAN_PROFILES[profileIndex];
  const assessmentResult = useMemo(
    () => scanProfileToAssessmentResult(profile),
    [profile]
  );

  const handleAnalyzeComplete = useCallback(() => setPhase("results"), []);

  useEffect(() => {
    if (!isInView) {
      setPhase("scan");
      setProfileIndex(0);
      setScanProgress(0);
    }
  }, [isInView]);

  useEffect(() => {
    if (!isInView || phase !== "scan") return;

    const start = Date.now();
    const tick = setInterval(() => {
      setScanProgress(Math.min(((Date.now() - start) / SCAN_MS) * 100, 100));
    }, 40);

    const next = setTimeout(() => {
      setPhase("analyzing");
      setScanProgress(100);
    }, SCAN_MS);

    return () => {
      clearInterval(tick);
      clearTimeout(next);
    };
  }, [isInView, phase, profileIndex]);

  useEffect(() => {
    if (!isInView || phase !== "results") return;
    const next = setTimeout(() => {
      setProfileIndex((i) => (i + 1) % SCAN_PROFILES.length);
      setPhase("scan");
      setScanProgress(0);
    }, RESULTS_MS);
    return () => clearTimeout(next);
  }, [isInView, phase, profileIndex]);

  return (
    <ProductFrame ref={ref} title={title}>
      <div
        className="relative overflow-hidden"
        style={{ height: FRAME_HEIGHT_PX }}
      >
        <AnimatePresence mode="wait">
          {phase === "scan" && (
            <motion.div
              key="scan"
              {...phaseMotion}
              className="absolute inset-0 grid md:grid-cols-[1.1fr_0.9fr]"
            >
              <ScanPhasePanel profile={profile} progress={scanProgress} />
              <UploadPromptPanel profile={profile} progress={scanProgress} />
            </motion.div>
          )}

          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              {...phaseMotion}
              className="absolute inset-0 p-3"
            >
              <TimelineLoader
                compact
                fillHeight
                title="Building your assessment"
                subtitle={`Digital Technology · ${profile.name}`}
                badge="Deep research"
                stepDuration={DEMO_STEP_MS}
                completeHoldMs={500}
                footer="Demo — run the full assessment with your CV"
                steps={[...DEMO_LOADER_STEPS]}
                onComplete={handleAnalyzeComplete}
              />
            </motion.div>
          )}

          {phase === "results" && (
            <motion.div
              key="results"
              {...phaseMotion}
              className="absolute inset-0 overflow-hidden p-3"
            >
              <AnalysisResults
                result={assessmentResult}
                embedded
                hideDisclaimer
                className="h-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProductFrame>
  );
}

function ScanPhasePanel({
  profile,
  progress,
}: {
  profile: (typeof SCAN_PROFILES)[number];
  progress: number;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col border-b border-white/[0.06] p-4 md:border-b-0 md:border-r">
      <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-wider text-text-muted">
          Step 1 · Upload resume
        </p>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-linear-accent-muted px-2 py-0.5 text-[9px] text-linear-accent">
          <Loader2 className="size-2.5 animate-spin" />
          Scanning
        </span>
      </div>

      <div className="resume-scanner-viewport relative min-h-0 flex-1 overflow-hidden">
        <div className="resume-scanner-paper relative is-scanning h-full max-h-full">
          <ResumeDocument profile={profile} variant="scanner" />
          <div className="resume-scanner-scan-overlay pointer-events-none absolute inset-0 rounded-sm">
            <span className="resume-scanner-corner resume-scanner-corner-tl" />
            <span className="resume-scanner-corner resume-scanner-corner-tr" />
            <span className="resume-scanner-corner resume-scanner-corner-bl" />
            <span className="resume-scanner-corner resume-scanner-corner-br" />
            <motion.div
              className="resume-scanner-beam absolute inset-x-0"
              animate={{ top: `${progress}%` }}
              transition={{ duration: 0.12, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 shrink-0">
        <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-linear-accent transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-[10px] text-text-muted">
          <ScanLine className="size-3" />
          Parsing CV for {profile.techNationFit}…
        </p>
      </div>
    </div>
  );
}

function UploadPromptPanel({
  profile,
  progress,
}: {
  profile: (typeof SCAN_PROFILES)[number];
  progress: number;
}) {
  const checks = [
    "Innovation in digital technology",
    "Recognition beyond occupation",
    "Significant technical contribution",
    "UK contribution plan",
  ] as const;

  const activeCheck = Math.min(
    Math.floor((progress / 100) * checks.length),
    checks.length - 1
  );

  return (
    <div className="flex h-full min-h-0 flex-col justify-center p-4">
      <div className="rounded-xl border border-dashed border-linear-accent/30 bg-linear-accent-muted/20 p-4 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-linear-accent-muted">
          <Upload className="size-4 text-linear-accent" />
        </div>
        <p className="mt-2 text-sm font-medium text-text-primary">
          {profile.name}&apos;s CV
        </p>
        <p className="mt-0.5 text-xs text-text-secondary">
          {profile.role} · {profile.company}
        </p>
      </div>

      <ul className="mt-4 space-y-1.5">
        {checks.map((label, i) => {
          const done = i < activeCheck;
          const active = i === activeCheck;

          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[10px] transition-colors",
                active
                  ? "border-linear-accent/40 bg-linear-accent-muted/50 text-text-primary"
                  : done
                    ? "border-white/[0.04] bg-surface-elevated/60 text-text-secondary"
                    : "border-transparent bg-surface-elevated text-text-muted"
              )}
            >
              {done ? (
                <CheckCircle2 className="size-3 shrink-0 text-linear-accent" />
              ) : active ? (
                <Loader2 className="size-3 shrink-0 animate-spin text-linear-accent" />
              ) : (
                <ScanLine className="size-3 shrink-0" />
              )}
              <span className="line-clamp-1">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
