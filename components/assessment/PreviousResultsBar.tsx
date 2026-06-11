"use client";

import { History } from "lucide-react";
import { getRouteById } from "@/lib/assessment";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { cn } from "@/lib/utils";
import type { SavedAssessment } from "@/store/assessmentSlice";

type Props = {
  items: SavedAssessment[];
  /** Internal id — used for selection highlight, never shown to the user */
  activeId?: string | null;
  onSelect: (id: string) => void;
};

/** Lists all saved assessments with route, score, and relative time */
export function PreviousResultsBar({ items, activeId, onSelect }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-linear-accent/20 bg-linear-accent-muted/20 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
        <History className="size-3 text-linear-accent" />
        Previous assessments
        <span className="normal-case tracking-normal text-text-muted/80">
          ({items.length})
        </span>
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const route = getRouteById(item.routeId);
          const isActive = item.id === activeId;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-xs transition-colors",
                  isActive
                    ? "bg-linear-accent/15 text-text-primary ring-1 ring-linear-accent/25"
                    : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                )}
              >
                <span className="min-w-0">
                  <span className="font-medium">{route.label}</span>
                  <span className="text-text-muted"> · </span>
                  <span className={isActive ? "text-linear-accent" : ""}>
                    {item.result.score}/100
                  </span>
                  {isActive && (
                    <span className="ml-2 text-[10px] text-linear-accent">
                      Viewing
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-[11px] text-text-muted">
                  {formatRelativeTime(item.savedAt)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
