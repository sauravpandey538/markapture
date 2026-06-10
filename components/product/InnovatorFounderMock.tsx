"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { ProductFrame } from "@/components/product/ProductFrame";
import { INNOVATOR_SCENARIOS } from "@/lib/product-demos";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { cn } from "@/lib/utils";

type Phase = "scan" | "results";

const SCAN_MS = 3200;
const RESULTS_MS = 6000;

/** Dynamic Innovator Founder business plan stress-test demo */
export function InnovatorFounderMock() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("scan");
  const [activeSection, setActiveSection] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  const scenario = INNOVATOR_SCENARIOS[scenarioIndex];
  const animatedReadiness = useAnimatedNumber(
    scenario.readiness,
    1000,
    phase === "results"
  );

  // Section-by-section scan during scan phase
  useEffect(() => {
    if (phase !== "scan") return;

    const start = Date.now();
    const progressTick = setInterval(() => {
      setScanProgress(Math.min(((Date.now() - start) / SCAN_MS) * 100, 100));
    }, 40);

    const sectionTick = setInterval(() => {
      setActiveSection((s) => {
        if (s >= scenario.sections.length - 1) return s;
        return s + 1;
      });
    }, SCAN_MS / scenario.sections.length);

    const done = setTimeout(() => {
      setPhase("results");
      setActiveSection(0);
      setScanProgress(0);
    }, SCAN_MS);

    return () => {
      clearInterval(progressTick);
      clearInterval(sectionTick);
      clearTimeout(done);
    };
  }, [phase, scenarioIndex, scenario.sections.length]);

  useEffect(() => {
    if (phase !== "results") return;

    const next = setTimeout(() => {
      setScenarioIndex((i) => (i + 1) % INNOVATOR_SCENARIOS.length);
      setPhase("scan");
      setActiveSection(0);
    }, RESULTS_MS);

    return () => clearTimeout(next);
  }, [phase, scenarioIndex]);

  return (
    <ProductFrame title="markapture — innovator founder">
      <div className="min-h-[360px] p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              Business plan analyser
            </p>
            <p className="text-sm font-medium text-text-primary">
              {scenario.venture}
            </p>
          </div>
          {phase === "scan" ? (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-linear-accent-muted px-2.5 py-1 text-[10px] text-linear-accent">
              <Loader2 className="size-3 animate-spin" />
              Stress-testing…
            </span>
          ) : (
            <div className="text-right">
              <p className="text-[10px] text-text-muted">Endorser readiness</p>
              <p className="text-2xl font-semibold text-text-primary">
                {animatedReadiness}%
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {scenario.sections.map((section, i) => {
            const isScanning = phase === "scan" && i === activeSection;
            const isDone = phase === "results" || (phase === "scan" && i < activeSection);
            const showScore = phase === "results";

            return (
              <div
                key={section.title}
                className={cn(
                  "rounded-lg p-3 transition-all duration-500",
                  isScanning && "animate-scan-pulse bg-linear-accent-muted",
                  !isScanning && "bg-surface-elevated",
                  isDone && phase === "scan" && "opacity-60"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {showScore ? (
                      section.status === "pass" ? (
                        <CheckCircle2 className="size-3.5 text-linear-accent" />
                      ) : (
                        <AlertCircle className="size-3.5 text-amber-400" />
                      )
                    ) : isScanning ? (
                      <Loader2 className="size-3.5 animate-spin text-linear-accent" />
                    ) : (
                      <Lightbulb className="size-3.5 text-text-muted" />
                    )}
                    <span className="text-xs font-medium text-text-primary">
                      {section.title}
                    </span>
                  </div>
                  {showScore && (
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        section.score >= 80
                          ? "text-linear-accent"
                          : "text-amber-400"
                      )}
                    >
                      {section.score}%
                    </span>
                  )}
                </div>

                {(isScanning || showScore) && (
                  <p
                    className={cn(
                      "mt-2 text-[11px] text-text-secondary",
                      showScore && "animate-fade-slide-up"
                    )}
                  >
                    {section.note}
                  </p>
                )}

                {showScore && (
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        section.score >= 80 ? "bg-linear-accent" : "bg-amber-400"
                      )}
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {phase === "scan" && (
          <div className="mt-4">
            <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-linear-accent transition-all duration-100"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {phase === "results" && (
          <div
            key={scenarioIndex}
            className="mt-4 flex items-start gap-2 rounded-lg bg-linear-accent-muted p-3 animate-fade-slide-up"
          >
            <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-linear-accent" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-linear-accent">
                Endorser verdict
              </p>
              <p className="mt-1 text-[11px] text-text-secondary">
                {scenario.endorserVerdict}
              </p>
            </div>
          </div>
        )}
      </div>
    </ProductFrame>
  );
}
