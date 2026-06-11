"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PreviousResultsBar } from "@/components/assessment/PreviousResultsBar";
import { CTAButton } from "@/components/ui/CTAButton";
import { RouteSelectStep } from "@/components/assessment/RouteSelectStep";
import { QuestionsStep } from "@/components/assessment/QuestionsStep";
import { ResumeUploadStep } from "@/components/assessment/ResumeUploadStep";
import { QuestionGeneratingLoader } from "@/components/assessment/QuestionGeneratingLoader";
import { AnalysisLoading } from "@/components/assessment/AnalysisLoading";
import { AnalysisResults } from "@/components/assessment/AnalysisResults";
import { AssessmentResultsFooter } from "@/components/assessment/AssessmentResultsFooter";
import type {
  AssessmentResult,
  DynamicQuestion,
  GeneratedQuestions,
  GtRouteId,
} from "@/lib/assessment";
import { isGtRouteId } from "@/lib/assessment";
import { fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearViewingResult,
  saveAssessmentResult,
  setViewingResult,
} from "@/store/assessmentSlice";

type WizardStep =
  | "route"
  | "resume"
  | "generating-questions"
  | "questions"
  | "analyzing"
  | "results";

/** URL `page` values — session state is in-memory only (not Redux) */
type PageParam = "resume" | "questionnaire" | "result";

const STEP_LABELS: Record<WizardStep, string> = {
  route: "Choose path",
  resume: "Upload resume",
  "generating-questions": "Reading CV",
  questions: "Quick questions",
  analyzing: "Analysing",
  results: "Your assessment",
};

const PROGRESS_STEPS = ["route", "resume", "questions"] as const;

function buildAssessmentPath(
  routeId: GtRouteId | null,
  page: PageParam | null,
): string {
  const params = new URLSearchParams();
  if (page === "result") {
    params.set("page", "result");
  } else if (routeId && page) {
    params.set("route", routeId);
    params.set("page", page);
  }
  const qs = params.toString();
  return qs ? `/global-talent/assessment?${qs}` : "/global-talent/assessment";
}

type Props = {
  initialPage?: string;
  initialRoute?: string;
};

function resolveRouteFromParams(
  routeParam: string | null | undefined,
): GtRouteId | null {
  return isGtRouteId(routeParam) ? routeParam : null;
}

/** Sync initial wizard step from server URL — avoids flash before Redux rehydrates */
function resolveInitialStep(
  page: string | null | undefined,
  route: GtRouteId | null,
): WizardStep {
  if (page === "result") return "route";
  if (page === "questionnaire" && route) return "resume";
  if (page === "resume" && route) return "resume";
  return "route";
}

export function AssessmentWizard({ initialPage, initialRoute }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const savedResults = useAppSelector((s) => s.assessment.savedResults);
  const viewingResultId = useAppSelector((s) => s.assessment.viewingResultId);
  const rehydrated = useAppSelector((s) => {
    const slice = s.assessment as typeof s.assessment & {
      _persist?: { rehydrated?: boolean };
    };
    return slice._persist?.rehydrated ?? false;
  });

  const initialRouteId = resolveRouteFromParams(initialRoute);
  const [step, setStep] = useState<WizardStep>(() =>
    resolveInitialStep(initialPage, initialRouteId),
  );
  const [routeId, setRouteId] = useState<GtRouteId | null>(initialRouteId);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    DynamicQuestion[]
  >([]);
  const [resumeSummary, setResumeSummary] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const urlInitialized = useRef(false);

  const readPageParam = useCallback((): PageParam | null => {
    const raw = searchParams.get("page") ?? initialPage ?? null;
    if (raw === "resume" || raw === "questionnaire" || raw === "result") {
      return raw;
    }
    return null;
  }, [searchParams, initialPage]);

  const readRouteParam = useCallback((): GtRouteId | null => {
    const raw = searchParams.get("route") ?? initialRoute ?? null;
    return isGtRouteId(raw) ? raw : null;
  }, [searchParams, initialRoute]);

  const syncUrl = useCallback(
    (nextRouteId: GtRouteId | null, page: PageParam | null) => {
      router.replace(buildAssessmentPath(nextRouteId, page), { scroll: false });
    },
    [router],
  );

  // Apply URL params once — session form state is in-memory only
  useEffect(() => {
    if (!rehydrated || urlInitialized.current) return;

    const page = readPageParam();
    const routeFromUrl = readRouteParam();

    // No deep-link params — keep default route step
    if (!page && !routeFromUrl) {
      urlInitialized.current = true;
      return;
    }

    if (page === "result") {
      if (savedResults.length === 0) return;
      const saved =
        savedResults.find((r) => r.id === viewingResultId) ?? savedResults[0];
      setResult(saved.result);
      setStep("results");
      syncUrl(null, "result");
      urlInitialized.current = true;
      return;
    }

    if (page === "questionnaire" && routeFromUrl) {
      // Hard refresh: dynamic questions are not cached — resume upload again
      setRouteId(routeFromUrl);
      setStep("resume");
      syncUrl(routeFromUrl, "resume");
      urlInitialized.current = true;
      return;
    }

    if (page === "resume" && routeFromUrl) {
      setRouteId(routeFromUrl);
      setStep("resume");
      urlInitialized.current = true;
      return;
    }

    urlInitialized.current = true;
  }, [
    rehydrated,
    readPageParam,
    readRouteParam,
    savedResults,
    viewingResultId,
    syncUrl,
  ]);

  const currentProgressIndex = useMemo(() => {
    if (step === "route") return 0;
    if (step === "resume" || step === "generating-questions") return 1;
    if (step === "questions") return 2;
    return 2;
  }, [step]);

  const goToStep = (
    next: WizardStep,
    options?: { route?: GtRouteId | null },
  ) => {
    const activeRoute = options?.route ?? routeId;
    setStep(next);

    if (next === "resume" && activeRoute) {
      syncUrl(activeRoute, "resume");
    } else if (next === "questions" && activeRoute) {
      syncUrl(activeRoute, "questionnaire");
    } else if (next === "results") {
      syncUrl(null, "result");
    } else if (next === "route") {
      syncUrl(null, null);
    }
  };

  const handleRouteSelect = (id: GtRouteId) => {
    if (id !== routeId) {
      setGeneratedQuestions([]);
      setResumeSummary("");
      setAnswers({});
      setResumeFile(null);
    }
    setRouteId(id);
  };

  const handleViewSavedResult = (id: string) => {
    const saved = savedResults.find((r) => r.id === id);
    if (!saved) return;
    setResult(saved.result);
    dispatch(setViewingResult(id));
    setStep("results");
    syncUrl(null, "result");
  };

  const handleGenerateQuestions = async () => {
    if (!routeId || !resumeFile) return;

    setError(null);
    setStep("generating-questions");

    try {
      const formData = new FormData();
      formData.append("routeId", routeId);
      formData.append("resume", resumeFile);

      const response = await fetch("/api/assessment/generate-questions", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as GeneratedQuestions & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate questions");
      }

      setGeneratedQuestions(data.questions);
      setResumeSummary(data.resumeSummary);
      setAnswers({});
      goToStep("questions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      goToStep("resume");
    }
  };

  const validateQuestions = (): boolean => {
    return generatedQuestions.every((q) => answers[q.id]?.trim());
  };

  const handleAnalyze = async () => {
    if (!routeId || !resumeFile) return;

    setError(null);
    setResult(null);
    setStep("analyzing");

    try {
      const formData = new FormData();
      formData.append("routeId", routeId);
      formData.append("answers", JSON.stringify(answers));
      formData.append("questions", JSON.stringify(generatedQuestions));
      formData.append("resume", resumeFile);

      const response = await fetch("/api/assessment/analyze", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        result?: AssessmentResult;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      const assessment = data.result!;
      setResult(assessment);

      const nameAnswer = generatedQuestions.find((q) =>
        /name|email/i.test(q.id + q.label),
      );
      const applicantName =
        (nameAnswer && answers[nameAnswer.id]) ||
        resumeSummary.split(" ")[0] ||
        assessment.route;

      dispatch(
        saveAssessmentResult({
          routeId,
          result: assessment,
          applicantName,
        }),
      );
      goToStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      goToStep("questions");
    }
  };

  const handleStartNew = () => {
    dispatch(clearViewingResult());
    setRouteId(null);
    setGeneratedQuestions([]);
    setResumeSummary("");
    setAnswers({});
    setResumeFile(null);
    setResult(null);
    setError(null);
    syncUrl(null, null);
    setStep("route");
  };

  const goBack = () => {
    setError(null);
    if (step === "questions") {
      goToStep("resume");
      return;
    }
    if (step === "resume") {
      goToStep("route");
    }
  };

  const showProgress =
    step !== "analyzing" &&
    step !== "results" &&
    step !== "generating-questions";

  const showResultsHistory =
    savedResults.length > 0 &&
    step !== "analyzing" &&
    step !== "generating-questions";

  const activeResultId = viewingResultId ?? savedResults[0]?.id ?? null;

  return (
    <div
      className={cn(
        "mx-auto w-full transition-[max-width] duration-300",
        step === "results" ? "max-w-6xl" : "max-w-3xl",
      )}
    >
      {showResultsHistory && (
        <PreviousResultsBar
          items={savedResults}
          activeId={step === "results" ? activeResultId : null}
          onSelect={handleViewSavedResult}
        />
      )}

      {showProgress && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-text-muted">
            <span>{STEP_LABELS[step]}</span>
            <span>Step {currentProgressIndex + 1} of 3</span>
          </div>
          <div className="flex gap-2">
            {PROGRESS_STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= currentProgressIndex
                    ? "bg-linear-accent"
                    : "bg-white/[0.06]",
                )}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "route" && (
          <motion.div
            key="route"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <RouteSelectStep
              selected={routeId}
              onSelect={handleRouteSelect}
              onContinue={() =>
                routeId && goToStep("resume", { route: routeId })
              }
            />
          </motion.div>
        )}

        {step === "resume" && routeId && (
          <motion.div
            key="resume"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <ResumeUploadStep
              routeId={routeId}
              file={resumeFile}
              onFileChange={setResumeFile}
              error={error}
            />
            <WizardNav
              onBack={goBack}
              backLabel="Change path"
              onNext={handleGenerateQuestions}
              nextLabel="Read CV & generate questions"
              nextDisabled={!resumeFile}
            />
          </motion.div>
        )}

        {step === "generating-questions" && routeId && (
          <motion.div
            key="generating-questions"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <QuestionGeneratingLoader routeId={routeId} />
          </motion.div>
        )}

        {step === "questions" && routeId && generatedQuestions.length > 0 && (
          <motion.div
            key="questions"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <QuestionsStep
              routeId={routeId}
              questions={generatedQuestions}
              resumeSummary={resumeSummary}
              answers={answers}
              onChange={(key, value) =>
                setAnswers((prev) => ({ ...prev, [key]: value }))
              }
            />
            <WizardNav
              onBack={goBack}
              backLabel="Change resume"
              onNext={() => {
                if (!validateQuestions()) {
                  setError("Please answer all questions before continuing");
                  return;
                }
                setError(null);
                handleAnalyze();
              }}
              nextLabel="Run full assessment"
              error={error}
            />
          </motion.div>
        )}

        {step === "analyzing" && routeId && (
          <motion.div
            key="analyzing"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <AnalysisLoading routeId={routeId} />
          </motion.div>
        )}

        {step === "results" && result && (
          <motion.div
            key="results"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <AnalysisResults result={result} />
            <AssessmentResultsFooter
              result={result}
              onStartNew={handleStartNew}
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
  error,
}: {
  onBack: () => void;
  backLabel: string;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  error?: string | null;
}) {
  return (
    <div className="mt-8 space-y-3 border-t border-white/[0.06] pt-6">
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="size-3.5" />
          {backLabel}
        </button>
        <CTAButton
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex items-center gap-1.5"
        >
          {nextLabel}
          <ArrowRight className="size-3.5" />
        </CTAButton>
      </div>
    </div>
  );
}
