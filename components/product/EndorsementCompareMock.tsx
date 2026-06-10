"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileWarning,
  Sparkles,
  XCircle,
} from "lucide-react";
import { ProductFrame } from "@/components/product/ProductFrame";
import { WITHOUT_PACK, WITH_PACK } from "@/lib/product-demos";
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

/** Full-width hero demo — endorsement without vs with Markapture */
export function EndorsementCompareMock() {
  const [activeSide, setActiveSide] = useState<"without" | "with">("without");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSide((s) => (s === "without" ? "with" : "without"));
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <ProductFrame title="markapture — endorsement comparison" className="w-full">
      <div className="grid md:grid-cols-2">
        {/* Without */}
        <div
          className={cn(
            "border-b border-white/[0.06] p-5 transition-all duration-700 md:border-b-0 md:border-r",
            activeSide === "without" ? "bg-red-500/[0.04] opacity-100" : "opacity-45"
          )}
        >
          <Header
            icon={<FileWarning className="size-4 text-amber-400" />}
            title="Without Markapture"
            badge="Typical self-filed pack"
            badgeClass="bg-amber-500/15 text-amber-400"
          />

          <PackList docs={WITHOUT_PACK} variant="without" active={activeSide === "without"} />

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

          <Checklist items={WITHOUT_ITEMS} variant="without" active={activeSide === "without"} />

          <ScoreBar score={38} variant="without" />
        </div>

        {/* With */}
        <div
          className={cn(
            "p-5 transition-all duration-700",
            activeSide === "with" ? "bg-linear-accent/[0.06] opacity-100" : "opacity-45"
          )}
        >
          <Header
            icon={<Sparkles className="size-4 text-linear-accent" />}
            title="With Markapture"
            badge="Structured endorsement pack"
            badgeClass="bg-linear-accent-muted text-linear-accent"
          />

          <PackList docs={WITH_PACK} variant="with" active={activeSide === "with"} />

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

          <Checklist items={WITH_ITEMS} variant="with" active={activeSide === "with"} />

          <ScoreBar score={87} variant="with" />
        </div>
      </div>

      <div className="flex justify-center gap-2 border-t border-white/[0.06] py-3">
        {(["without", "with"] as const).map((side) => (
          <span
            key={`${side}-${tick}`}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              activeSide === side ? "w-8 bg-linear-accent" : "w-2 bg-white/10"
            )}
          />
        ))}
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
  active,
}: {
  docs: typeof WITHOUT_PACK;
  variant: "without" | "with";
  active: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-wider text-text-muted">
        Application documents
      </p>
      {docs.map((doc, i) => (
        <div
          key={doc.title}
          className={cn(
            "flex items-start gap-2.5 rounded-lg bg-surface-elevated px-3 py-2.5 transition-all duration-500",
            active && "animate-fade-slide-up"
          )}
          style={{ animationDelay: `${i * 60}ms` }}
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
        </div>
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
  active,
}: {
  items: string[];
  variant: "without" | "with";
  active: boolean;
}) {
  const Icon = variant === "with" ? CheckCircle2 : XCircle;
  const iconClass = variant === "with" ? "text-linear-accent" : "text-amber-400";

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item, i) => (
        <li
          key={item}
          className={cn(
            "flex items-start gap-2 text-[11px] text-text-secondary",
            active && "animate-fade-slide-up"
          )}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <Icon className={cn("mt-0.5 size-3 shrink-0", iconClass)} />
          {item}
        </li>
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
