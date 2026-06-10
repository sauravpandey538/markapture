import { CONSULTATION_SESSION_TIMELINE } from "@/lib/timelines";

/** Right-column timeline for book consultation — what happens before, during, after */
export function SessionTimeline() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Your session
        </p>
        <h3 className="mt-2 text-xl font-semibold text-text-primary">
          How the 30 minutes work
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          A structured call with Nabila Farzin — not a sales pitch. You&apos;ll
          leave knowing your likely route and what to prepare next.
        </p>
      </div>

      <div className="relative space-y-0">
        {CONSULTATION_SESSION_TIMELINE.map((block, index) => (
          <div key={block.phase} className="relative flex gap-4 pb-8 last:pb-0">
            {index < CONSULTATION_SESSION_TIMELINE.length - 1 && (
              <div
                className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-px bg-linear-accent/25"
                aria-hidden
              />
            )}
            <div className="relative z-10 mt-1 size-3.5 shrink-0 rounded-full bg-linear-accent ring-4 ring-bg" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-text-primary">
                  {block.phase}
                </p>
                <span className="text-[10px] text-text-muted">{block.duration}</span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs leading-relaxed text-text-secondary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-linear-accent-muted p-5">
        <p className="text-xs font-medium text-linear-accent">Come prepared</p>
        <ul className="mt-3 space-y-2 text-xs text-text-secondary">
          <li>· Current profession & years of experience</li>
          <li>· Which route you&apos;ve considered (if any)</li>
          <li>· Your UK relocation timeline</li>
          <li>· CV uploaded below before booking</li>
        </ul>
      </div>
    </div>
  );
}
