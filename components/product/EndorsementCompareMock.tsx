"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileWarning,
  Sparkles,
  XCircle,
} from "lucide-react";
import { ProductFrame } from "@/components/product/ProductFrame";
import { useDemoInView } from "@/hooks/useDemoInView";
import { WITHOUT_PACK, WITH_PACK } from "@/lib/product-demos";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const WITHOUT_ITEMS = [
  "Route unclear — filing without eligibility check",
  "CV not aligned to Tech Nation rubric",
  "Referees unaware of endorser criteria",
  "Evidence gaps discovered only after rejection",
  "Personal statement reads generic, not exceptional",
];

const WITH_ITEMS = [
  "Route confirmed: Global Talent — Digital Technology",
  "CV scored & mapped to all 4 mandatory criteria",
  "Referee pack prepared with talking points",
  "12 evidence items catalogued, 2 gaps prioritised",
  "Statement structured for endorser review",
];

const WITHOUT_MS = 7000;

/** Hero demo — Without for 7s, then locks on With so users can read */
export function EndorsementCompareMock() {
  const { ref, isInView } = useDemoInView(0.3);
  const [activeSide, setActiveSide] = useState<"without" | "with">("without");
  const [withRevealed, setWithRevealed] = useState(false);
  const isLockedOnWith = activeSide === "with";

  useEffect(() => {
    if (!isInView) {
      setActiveSide("without");
      setWithRevealed(false);
      return;
    }

    const id = setTimeout(() => {
      setActiveSide("with");
      setWithRevealed(true);
    }, WITHOUT_MS);
    return () => clearTimeout(id);
  }, [isInView]);

  return (
    <ProductFrame ref={ref} title="markapture — endorsement comparison" className="w-full">
      <div className="grid md:grid-cols-2">
        {/* Without */}
        <motion.div
          animate={{
            opacity: activeSide === "without" ? 1 : 0.45,
            backgroundColor:
              activeSide === "without"
                ? "rgba(239, 68, 68, 0.04)"
                : "rgba(0, 0, 0, 0)",
          }}
          transition={{ duration: 0.5 }}
          className="border-b border-white/[0.06] p-5 md:border-b-0 md:border-r"
        >
          <Header
            icon={<FileWarning className="size-4 text-amber-400" />}
            title="Without Markapture"
            badge="Typical self-filed pack"
            badgeClass="bg-amber-500/15 text-amber-400"
          />

          <PackList
            docs={WITHOUT_PACK}
            variant="without"
            animateIn={activeSide === "without"}
          />

          <p className="mb-3 mt-4 text-[10px] uppercase tracking-wider text-text-muted">
            What endorsers see
          </p>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2.5">
            <p className="text-[11px] leading-relaxed text-amber-400/90">
              &ldquo;The applicant has not demonstrated exceptional talent. Evidence
              is insufficient and the personal statement does not address mandatory
              criteria. Recommend resubmission.&rdquo;
            </p>
            <p className="mt-2 text-[10px] text-amber-400/60">
              — Typical Tech Nation assessor feedback
            </p>
          </div>

          <Checklist
            items={WITHOUT_ITEMS}
            variant="without"
            animateIn={activeSide === "without"}
          />

          <ScoreBar score={38} variant="without" />
        </motion.div>

        {/* With */}
        <motion.div
          animate={{
            opacity: activeSide === "with" ? 1 : 0.45,
            backgroundColor:
              activeSide === "with"
                ? "rgba(94, 106, 210, 0.06)"
                : "rgba(0, 0, 0, 0)",
          }}
          transition={{ duration: 0.5 }}
          className="p-5"
        >
          <Header
            icon={<Sparkles className="size-4 text-linear-accent" />}
            title="With Markapture"
            badge="Structured endorsement pack"
            badgeClass="bg-linear-accent-muted text-linear-accent"
          />

          <PackList
            key={withRevealed ? "with-pack-in" : "with-pack-wait"}
            docs={WITH_PACK}
            variant="with"
            animateIn={withRevealed}
          />

          <p className="mb-3 mt-4 text-[10px] uppercase tracking-wider text-text-muted">
            What endorsers see
          </p>
          <div className="rounded-lg border border-linear-accent/25 bg-linear-accent-muted px-3 py-2.5">
            <p className="text-[11px] leading-relaxed text-text-primary">
              &ldquo;Clear case for exceptional talent in digital technology.
              Innovation, recognition, and commercial contribution are evidenced
              with quantified impact. Referees aligned. Recommend endorsement.&rdquo;
            </p>
            <p className="mt-2 text-[10px] text-linear-accent">
              — Endorser-ready assessment via Markapture
            </p>
          </div>

          <Checklist
            key={withRevealed ? "with-list-in" : "with-list-wait"}
            items={WITH_ITEMS}
            variant="with"
            animateIn={withRevealed}
          />

          <ScoreBar score={87} variant="with" />
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] py-3">
        {(["without", "with"] as const).map((side) => (
          <span
            key={side}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              activeSide === side ? "w-8 bg-linear-accent" : "w-2 bg-white/10"
            )}
          />
        ))}
        {isLockedOnWith && (
          <span className="ml-2 text-[9px] text-text-muted">With Markapture</span>
        )}
      </div>
    </ProductFrame>
  );
}

function Header({
  icon,
  title,
  badge,
  badgeClass,
}: {
  icon: React.ReactNode;
  title: string;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <p className="text-xs font-medium text-text-primary">{title}</p>
      <span className={cn("ml-auto rounded px-2 py-0.5 text-[10px]", badgeClass)}>
        {badge}
      </span>
    </div>
  );
}

function PackList({
  docs,
  variant,
  animateIn,
}: {
  docs: typeof WITHOUT_PACK;
  variant: "without" | "with";
  animateIn: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-wider text-text-muted">
        Application documents
      </p>
      {docs.map((doc, i) => (
        <motion.div
          key={doc.title}
          variants={fadeUp}
          initial={animateIn ? "hidden" : false}
          animate="visible"
          transition={{ delay: animateIn ? i * 0.06 : 0, duration: 0.45 }}
          className="flex items-start gap-2.5 rounded-lg bg-surface-elevated px-3 py-2.5"
        >
          <FileText className="mt-0.5 size-3.5 shrink-0 text-text-muted" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-text-primary">{doc.title}</p>
              {doc.score !== undefined && (
                <span className="shrink-0 text-[10px] font-semibold text-linear-accent">
                  {doc.score}%
                </span>
              )}
              {variant === "without" && (
                <StatusIcon status={doc.status} />
              )}
              {variant === "with" && (
                <CheckCircle2 className="size-3 shrink-0 text-linear-accent" />
              )}
            </div>
            <p className="mt-0.5 text-[10px] leading-relaxed text-text-muted">
              {doc.detail}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "missing") return <XCircle className="size-3 shrink-0 text-amber-400" />;
  return <AlertTriangle className="size-3 shrink-0 text-amber-400/70" />;
}

function Checklist({
  items,
  variant,
  animateIn,
}: {
  items: string[];
  variant: "without" | "with";
  animateIn: boolean;
}) {
  const Icon = variant === "with" ? CheckCircle2 : XCircle;
  const iconClass = variant === "with" ? "text-linear-accent" : "text-amber-400";

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item, i) => (
        <motion.li
          key={item}
          variants={fadeUp}
          initial={animateIn ? "hidden" : false}
          animate="visible"
          transition={{ delay: animateIn ? i * 0.08 : 0, duration: 0.45 }}
          className="flex items-start gap-2 text-[11px] text-text-secondary"
        >
          <Icon className={cn("mt-0.5 size-3 shrink-0", iconClass)} />
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

function ScoreBar({ score, variant }: { score: number; variant: "without" | "with" }) {
  const isWith = variant === "with";
  return (
    <div
      className={cn(
        "mt-4 rounded-lg px-3 py-2.5",
        isWith ? "bg-linear-accent-muted" : "bg-amber-500/10"
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-[11px]", isWith ? "text-linear-accent" : "text-amber-400")}>
          Endorsement readiness
        </span>
        <span className={cn("text-sm font-semibold", isWith ? "text-linear-accent" : "text-amber-400")}>
          {score}%
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            isWith ? "bg-linear-accent" : "bg-amber-400/60"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
