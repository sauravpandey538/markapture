"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  FileSearch,
  Loader2,
  Lock,
  ScanLine,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ProductFrame } from "@/components/product/ProductFrame";
import { useDemoInView } from "@/hooks/useDemoInView";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { INNOVATOR_SCENARIOS } from "@/lib/product-demos";
import { fadeIn, fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Phase = "scan" | "results";

const SCAN_MS = 3400;
const RESULTS_MS = 6500;
/** Tall enough for rich 2×2 grid + verdict without scrolling */
const STAGE_H = "h-[620px]";

/** Innovator Founder — distinct before (scan) vs after (results) demo */
export function InnovatorFounderMock() {
  const { ref, isInView } = useDemoInView();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("scan");
  const [activeSection, setActiveSection] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  const scenario = INNOVATOR_SCENARIOS[scenarioIndex];
  const passCount = scenario.sections.filter((s) => s.status === "pass").length;
  const gapCount = scenario.sections.length - passCount;
  const animatedReadiness = useAnimatedNumber(
    scenario.readiness,
    1100,
    phase === "results" && isInView
  );

  // Reset demo when scrolled out of viewport
  useEffect(() => {
    if (isInView) return;
    setPhase("scan");
    setScenarioIndex(0);
    setActiveSection(0);
    setScanProgress(0);
  }, [isInView]);

  useEffect(() => {
    if (!isInView || phase !== "scan") return;

    setActiveSection(0);
    setScanProgress(0);

    const start = Date.now();
    const sectionCount = scenario.sections.length;
    const sectionMs = SCAN_MS / sectionCount;

    const progressTick = setInterval(() => {
      setScanProgress(Math.min(((Date.now() - start) / SCAN_MS) * 100, 100));
    }, 40);

    const sectionTimers = Array.from({ length: sectionCount - 1 }, (_, i) =>
      setTimeout(() => setActiveSection(i + 1), sectionMs * (i + 1))
    );

    const done = setTimeout(() => {
      setPhase("results");
      setScanProgress(100);
    }, SCAN_MS);

    return () => {
      clearInterval(progressTick);
      sectionTimers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [isInView, phase, scenarioIndex, scenario.sections.length]);

  useEffect(() => {
    if (!isInView || phase !== "results") return;

    const next = setTimeout(() => {
      setScenarioIndex((i) => (i + 1) % INNOVATOR_SCENARIOS.length);
      setPhase("scan");
    }, RESULTS_MS);

    return () => clearTimeout(next);
  }, [isInView, phase, scenarioIndex]);

  return (
    <ProductFrame ref={ref} title="markapture — innovator founder">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className={cn(
            "flex flex-col overflow-hidden p-4 md:p-5",
            STAGE_H,
            phase === "scan"
              ? "bg-gradient-to-b from-linear-accent/[0.06] to-transparent"
              : "bg-gradient-to-b from-emerald-500/[0.05] to-transparent"
          )}
        >
        {/* Phase banner + venture — single compact header row */}
        <div
          className={cn(
            "mb-3 shrink-0 rounded-lg border px-3 py-2.5 transition-colors duration-500",
            phase === "scan"
              ? "border-linear-accent/25 bg-linear-accent-muted"
              : "border-emerald-500/20 bg-emerald-500/[0.08]"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2">
              {phase === "scan" ? (
                <FileSearch className="mt-0.5 size-3.5 shrink-0 text-linear-accent" />
              ) : (
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
              )}
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[9px] font-semibold uppercase tracking-wider",
                    phase === "scan" ? "text-linear-accent" : "text-emerald-400"
                  )}
                >
                  {phase === "scan" ? "Before — stress-testing" : "After — readiness report"}
                </p>
                <p className="truncate text-sm font-medium text-text-primary">
                  {scenario.venture}
                </p>
                <p className="mt-0.5 text-[10px] text-text-muted">
                  {phase === "scan"
                    ? "Mapping plan to endorser criteria · scores hidden"
                    : `${passCount} pass · ${gapCount} gap${gapCount !== 1 ? "s" : ""} flagged`}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              {phase === "scan" ? (
                <>
                  <span className="flex items-center gap-1 rounded-full border border-linear-accent/30 bg-surface-elevated px-2 py-0.5 text-[9px] text-linear-accent">
                    <Loader2 className="size-2.5 animate-spin" />
                    Scanning
                  </span>
                  <span className="text-[10px] font-medium tabular-nums text-linear-accent">
                    {Math.round(scanProgress)}%
                  </span>
                </>
              ) : (
                <>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[9px] font-medium",
                      scenario.readiness >= 80
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    )}
                  >
                    {scenario.readiness >= 80 ? "Filing-ready" : "Gaps to resolve"}
                  </span>
                  <span className="text-xl font-semibold leading-none tabular-nums text-emerald-400">
                    {animatedReadiness}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2×2 grid — stagger in when results appear */}
        <motion.div
          className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {phase === "scan"
            ? scenario.sections.map((section, i) => (
                <ScanSectionCard
                  key={`${scenarioIndex}-scan-${section.title}`}
                  section={section}
                  index={i}
                  isActive={i === activeSection}
                  isMapped={i < activeSection}
                  scanProgress={scanProgress}
                />
              ))
            : scenario.sections.map((section, i) => (
                <ResultsSectionCard
                  key={`${scenarioIndex}-result-${section.title}`}
                  section={section}
                  index={i}
                  isInView={isInView}
                />
              ))}
        </motion.div>

        {/* Footer verdict */}
        <div className="mt-3 shrink-0">
          <AnimatePresence mode="wait">
            {phase === "scan" ? (
              <motion.div
                key="scan-footer"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex items-center gap-3 rounded-lg border border-dashed border-white/[0.08] bg-surface-elevated/50 px-3 py-2.5"
              >
                <Lock className="size-3 shrink-0 text-text-muted" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-text-muted">
                    Endorser verdict locked until scan completes
                  </p>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full rounded-full bg-linear-accent"
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.15, ease: "linear" }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-[9px] tabular-nums text-text-muted">
                  {Math.round(scanProgress)}%
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="results-footer"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex items-start gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-2.5"
              >
                <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
                    Endorser verdict
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-text-secondary">
                    {scenario.endorserVerdict}
                  </p>
                  {gapCount > 0 && (
                    <p className="mt-1 text-[9px] text-amber-400/90">
                      Priority gaps:{" "}
                      {scenario.sections
                        .filter((s) => s.status === "warn")
                        .map((s) => s.title)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </motion.div>
      </AnimatePresence>
    </ProductFrame>
  );
}

function EvidenceTags({
  items,
  muted = false,
}: {
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "rounded px-1.5 py-px text-[8px] leading-tight",
            muted
              ? "bg-white/[0.04] text-text-muted"
              : "bg-white/[0.06] text-text-secondary"
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ScanSectionCard({
  section,
  index,
  isActive,
  isMapped,
  scanProgress,
}: {
  section: (typeof INNOVATOR_SCENARIOS)[number]["sections"][number];
  index: number;
  isActive: boolean;
  isMapped: boolean;
  scanProgress: number;
}) {
  const isPending = !isActive && !isMapped;

  return (
    <motion.div
      layout
      variants={scaleIn}
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden rounded-lg border p-2.5",
        isActive && "border-linear-accent/40 bg-linear-accent-muted shadow-[0_0_16px_rgba(94,106,210,0.1)]",
        isMapped && "border-white/[0.06] bg-surface-elevated/80",
        isPending && "border-dashed border-white/[0.08] bg-surface-elevated/40"
      )}
      animate={
        isActive
          ? { scale: 1.01, borderColor: "rgba(94,106,210,0.4)" }
          : { scale: 1, borderColor: undefined }
      }
      transition={{ duration: 0.3 }}
    >
      {isActive && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-px bg-linear-accent/80 shadow-[0_0_10px_rgba(94,106,210,0.5)]"
          animate={{ top: `${(scanProgress + index * 12) % 80}%` }}
          transition={{ duration: 0.12, ease: "linear" }}
        />
      )}

      <div className="flex items-center justify-between gap-1">
        <div className="flex min-w-0 items-center gap-1.5">
          {isActive ? (
            <Loader2 className="size-3 shrink-0 animate-spin text-linear-accent" />
          ) : isMapped ? (
            <CheckCircle2 className="size-3 shrink-0 text-linear-accent/70" />
          ) : (
            <CircleDashed className="size-3 shrink-0 text-text-muted" />
          )}
          <span className="truncate text-[11px] font-medium text-text-primary">
            {section.title}
          </span>
        </div>
        <span className="shrink-0 font-mono text-[9px] text-text-muted">
          {isMapped || isActive ? "···" : "—"}
        </span>
      </div>

      {isActive && (
        <>
          <p className="mt-1.5 flex items-start gap-1 text-[10px] leading-snug text-linear-accent">
            <ScanLine className="mt-0.5 size-2.5 shrink-0" />
            <span>{section.scanCheck}</span>
          </p>
          <EvidenceTags items={section.evidence} />
        </>
      )}

      {isMapped && !isActive && (
        <>
          <p className="mt-1.5 text-[10px] leading-snug text-text-muted">
            Evidence catalogued — {section.note}
          </p>
          <EvidenceTags items={section.evidence} muted />
        </>
      )}

      {isPending && (
        <>
          <p className="mt-1.5 text-[10px] leading-snug text-text-muted">
            Queued: {section.scanCheck}
          </p>
          <EvidenceTags items={section.evidence} muted />
        </>
      )}

      <div className="mt-auto pt-1.5">
        <div className="h-0.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className={cn(
              "h-full rounded-full",
              isActive ? "bg-linear-accent/80" : isMapped ? "bg-linear-accent/30" : "bg-transparent"
            )}
            animate={{
              width: isActive
                ? `${40 + (scanProgress % 35)}%`
                : isMapped
                  ? "100%"
                  : "0%",
            }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ResultsSectionCard({
  section,
  index,
  isInView,
}: {
  section: (typeof INNOVATOR_SCENARIOS)[number]["sections"][number];
  index: number;
  isInView: boolean;
}) {
  const animatedScore = useAnimatedNumber(
    section.score,
    700 + index * 100,
    isInView
  );
  const isPass = section.status === "pass";

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "flex min-h-0 flex-col rounded-lg border p-2.5",
        isPass
          ? "border-linear-accent/20 bg-surface-elevated"
          : "border-amber-500/25 bg-amber-500/[0.06]"
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex min-w-0 items-center gap-1.5">
          {isPass ? (
            <CheckCircle2 className="size-3 shrink-0 text-linear-accent" />
          ) : (
            <AlertCircle className="size-3 shrink-0 text-amber-400" />
          )}
          <span className="truncate text-[11px] font-medium text-text-primary">
            {section.title}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span
            className={cn(
              "rounded px-1 py-px text-[7px] font-semibold uppercase",
              isPass
                ? "bg-linear-accent-muted text-linear-accent"
                : "bg-amber-500/15 text-amber-400"
            )}
          >
            {isPass ? "Pass" : "Gap"}
          </span>
          <span
            className={cn(
              "text-[11px] font-semibold tabular-nums",
              isPass ? "text-linear-accent" : "text-amber-400"
            )}
          >
            {animatedScore}%
          </span>
        </div>
      </div>

      <p className="mt-1 text-[10px] font-medium leading-snug text-text-primary">
        {section.note}
      </p>
      <p className="mt-0.5 flex-1 text-[9px] leading-snug text-text-muted">
        {section.detail}
      </p>

      <EvidenceTags items={section.evidence} />

      {!isPass && (
        <p className="mt-1 text-[9px] leading-snug text-amber-400/90">
          Action: strengthen evidence before filing
        </p>
      )}

      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className={cn(
            "h-full rounded-full",
            isPass ? "bg-linear-accent" : "bg-amber-400"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${animatedScore}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
        />
      </div>
    </motion.div>
  );
}
