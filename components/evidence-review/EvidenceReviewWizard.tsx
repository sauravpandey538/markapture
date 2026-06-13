"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CriteriaSelectStep } from "@/components/evidence-review/CriteriaSelectStep";
import { EvidenceReviewLoading } from "@/components/evidence-review/EvidenceReviewLoading";
import { EvidenceReviewResults } from "@/components/evidence-review/EvidenceReviewResults";
import { EvidenceSelectStep } from "@/components/evidence-review/EvidenceSelectStep";
import { EvidenceUploadStep } from "@/components/evidence-review/EvidenceUploadStep";
import { CTAButton } from "@/components/ui/CTAButton";
import {
  criterionHasSingleOption,
  getEvidenceOption,
  getTechNationCriterion,
  isTechNationCriterionId,
  type EvidenceReviewResult,
} from "@/lib/evidence-review";
import { fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type WizardStep =
  | "criteria"
  | "evidence"
  | "upload"
  | "analyzing"
  | "results";

const PROGRESS_STEPS = ["criteria", "evidence", "upload"] as const;

type PageParam = "evidence" | "upload" | "result";

function buildPath(
  criterionId: string | null,
  optionId: string | null,
  page: PageParam | null
): string {
  const params = new URLSearchParams();
  if (page === "result") params.set("page", "result");
  else if (criterionId && page) {
    params.set("criterion", criterionId);
    if (optionId) params.set("evidence", optionId);
    params.set("page", page);
  }
  const qs = params.toString();
  return qs
    ? `/global-talent/evidence-review?${qs}`
    : "/global-talent/evidence-review";
}

type Props = {
  initialCriterion?: string;
  initialEvidence?: string;
  initialPage?: string;
};

/** Wizard: criterion section → evidence template → upload → LLM review */
export function EvidenceReviewWizard({
  initialCriterion,
  initialEvidence,
  initialPage,
}: Props) {
  const [step, setStep] = useState<WizardStep>("criteria");
  const [criterionId, setCriterionId] = useState<string | null>(null);
  const [optionId, setOptionId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<EvidenceReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState(false);

  const syncUrl = useCallback(
    (
      cId: string | null,
      oId: string | null,
      currentStep: WizardStep
    ) => {
      if (typeof window === "undefined") return;
      let page: PageParam | null = null;
      if (currentStep === "evidence") page = "evidence";
      else if (currentStep === "upload") page = "upload";
      else if (currentStep === "results") page = "result";

      const path = buildPath(cId, oId, page);
      if (window.location.pathname + window.location.search !== path) {
        window.history.replaceState(null, "", path);
      }
    },
    []
  );

  useEffect(() => {
    if (initialPage === "result") {
      setStep("criteria");
      return;
    }
    if (isTechNationCriterionId(initialCriterion)) {
      setCriterionId(initialCriterion);
      const criterion = getTechNationCriterion(initialCriterion);

      if (criterion?.options.length === 1) {
        setOptionId(criterion.options[0].id);
        if (initialPage === "upload") setStep("upload");
      } else if (initialEvidence) {
        const opt = getEvidenceOption(initialCriterion, initialEvidence);
        if (opt) {
          setOptionId(initialEvidence);
          if (initialPage === "upload") setStep("upload");
          else if (initialPage === "evidence") setStep("evidence");
        }
      } else if (initialPage === "evidence") {
        setStep("evidence");
      }
    }
  }, [initialCriterion, initialEvidence, initialPage]);

  const goTo = useCallback(
    (next: WizardStep) => {
      setStep(next);
      syncUrl(criterionId, optionId, next);
    },
    [criterionId, optionId, syncUrl]
  );

  const handleCriterionContinue = () => {
    if (!criterionId) return;
    setFile(null);
    setError(null);

    const criterion = getTechNationCriterion(criterionId);
    if (criterion?.options.length === 1) {
      setOptionId(criterion.options[0].id);
      goTo("upload");
      return;
    }

    setOptionId(null);
    goTo("evidence");
  };

  const handleEvidenceContinue = () => {
    if (!optionId) return;
    setFile(null);
    setError(null);
    goTo("upload");
  };

  const handleAnalyze = async () => {
    if (!criterionId || !optionId || !file) return;

    setError(null);
    setApiReady(false);
    setResult(null);
    goTo("analyzing");

    const formData = new FormData();
    formData.append("criterionId", criterionId);
    formData.append("evidenceIds", JSON.stringify([optionId]));
    formData.append(`file_${optionId}`, file);

    try {
      const response = await fetch("/api/evidence-review/analyze", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        result?: EvidenceReviewResult;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Review failed");
      }

      if (!data.result) {
        throw new Error("No result returned");
      }

      setResult(data.result);
      setApiReady(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setApiReady(false);
      goTo("upload");
    }
  };

  const handleLoadingComplete = useCallback(() => {
    goTo("results");
  }, [goTo]);

  const handleStartNew = () => {
    setCriterionId(null);
    setOptionId(null);
    setFile(null);
    setResult(null);
    setError(null);
    setApiReady(false);
    goTo("criteria");
  };

  const progressSteps: readonly ("criteria" | "evidence" | "upload")[] =
    criterionId && criterionHasSingleOption(criterionId)
      ? ["criteria", "upload"]
      : PROGRESS_STEPS;

  const progressIndex = (() => {
    if (step === "analyzing" || step === "results") {
      return progressSteps.length - 1;
    }
    if (step === "evidence") {
      const idx = progressSteps.indexOf("evidence");
      return idx >= 0 ? idx : 0;
    }
    const idx = progressSteps.indexOf(step as "criteria" | "upload");
    return idx >= 0 ? idx : 0;
  })();

  return (
    <div
      className={cn(
        "mx-auto",
        step === "results" ? "max-w-6xl" : "max-w-3xl"
      )}
    >
      {step !== "analyzing" && step !== "results" && (
        <div className="mb-8 flex items-center gap-2">
          {progressSteps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[10px] font-semibold",
                  i <= progressIndex
                    ? "bg-linear-accent text-white"
                    : "bg-white/[0.06] text-text-muted"
                )}
              >
                {i + 1}
              </div>
              {i < progressSteps.length - 1 && (
                <div
                  className={cn(
                    "h-px w-8",
                    i < progressIndex ? "bg-linear-accent" : "bg-white/[0.08]"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "criteria" && (
          <motion.div key="criteria" variants={fadeIn} initial="hidden" animate="visible" exit="hidden">
            <CriteriaSelectStep
              selected={criterionId}
              onSelect={setCriterionId}
              onContinue={handleCriterionContinue}
            />
          </motion.div>
        )}

        {step === "evidence" && criterionId && (
          <motion.div key="evidence" variants={fadeIn} initial="hidden" animate="visible" exit="hidden">
            <EvidenceSelectStep
              criterionId={criterionId}
              selected={optionId}
              onSelect={setOptionId}
              onContinue={handleEvidenceContinue}
            />
            <WizardNav
              onBack={() => goTo("criteria")}
              backLabel="Change criterion"
            />
          </motion.div>
        )}

        {step === "upload" && criterionId && optionId && (
          <motion.div key="upload" variants={fadeIn} initial="hidden" animate="visible" exit="hidden">
            <EvidenceUploadStep
              criterionId={criterionId}
              optionId={optionId}
              file={file}
              onFileChange={setFile}
              error={error}
            />
            <WizardNav
              onBack={() =>
                criterionId && criterionHasSingleOption(criterionId)
                  ? goTo("criteria")
                  : goTo("evidence")
              }
              backLabel={
                criterionId && criterionHasSingleOption(criterionId)
                  ? "Change document type"
                  : "Change evidence type"
              }
              onNext={handleAnalyze}
              nextLabel="Run evidence review"
              nextDisabled={!file}
            />
          </motion.div>
        )}

        {step === "analyzing" && criterionId && optionId && (
          <motion.div key="analyzing" variants={fadeIn} initial="hidden" animate="visible" exit="hidden">
            <EvidenceReviewLoading
              criterionId={criterionId}
              optionId={optionId}
              externalReady={apiReady}
              onComplete={handleLoadingComplete}
            />
          </motion.div>
        )}

        {step === "results" && result && (
          <motion.div key="results" variants={fadeIn} initial="hidden" animate="visible" exit="hidden">
            <EvidenceReviewResults
              result={result}
              onStartNew={handleStartNew}
              documentType={
                criterionId === "ps"
                  ? "ps"
                  : criterionId === "lor"
                    ? "lor"
                    : "evidence"
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WizardNav({
  onBack,
  backLabel,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  onBack: () => void;
  backLabel: string;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="size-3.5" />
        {backLabel}
      </button>
      {onNext && nextLabel && (
        <CTAButton
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex items-center gap-1.5"
        >
          {nextLabel}
          <ArrowRight className="size-3.5" />
        </CTAButton>
      )}
    </div>
  );
}
