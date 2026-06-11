"use client";

import { Route, CheckCircle2 } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { GT_ROUTES, type GtRouteId } from "@/lib/assessment";
import { cn } from "@/lib/utils";

type Props = {
  selected: GtRouteId | null;
  onSelect: (id: GtRouteId) => void;
  onContinue: () => void;
};

/** Step 1 — pick Global Talent endorsement sub-route */
export function RouteSelectStep({ selected, onSelect, onContinue }: Props) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-text-muted">
          Step 1
        </p>
        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          Choose your Global Talent path
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Select the endorsing body route that best matches your field. Your
          assessment will be scored against that route&apos;s criteria.
        </p>
      </div>

      <div className="space-y-2">
        {GT_ROUTES.map((route) => {
          const isSelected = selected === route.id;
          return (
            <button
              key={route.id}
              type="button"
              onClick={() => onSelect(route.id)}
              className={cn(
                "w-full rounded-xl p-4 text-left transition-all",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                isSelected
                  ? "bg-linear-accent-muted shadow-[inset_0_0_0_1px_rgba(94,106,210,0.4)]"
                  : "bg-surface-elevated hover:bg-surface"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Route
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      isSelected ? "text-linear-accent" : "text-text-muted"
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {route.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-linear-accent">
                      {route.endorser}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                      {route.description}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="size-4 shrink-0 text-linear-accent" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <CTAButton
          type="button"
          onClick={onContinue}
          disabled={!selected}
          className="w-full sm:w-auto"
        >
          Continue
        </CTAButton>
      </div>
    </div>
  );
}
