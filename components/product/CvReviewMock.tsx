import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ProductFrame } from "@/components/product/ProductFrame";

const FEEDBACK = [
  { status: "pass", text: "Leadership impact quantified in 3 roles" },
  { status: "pass", text: "Industry recognition section present" },
  { status: "warn", text: "Portfolio links need UK-relevant case studies" },
  { status: "warn", text: "Personal statement lacks endorser keywords" },
] as const;

/** Mock CV review UI for landing page */
export function CvReviewMock() {
  return (
    <ProductFrame title="markapture — cv review">
      <div className="grid grid-cols-5 gap-0">
        {/* CV preview pane */}
        <div className="col-span-3 border-r border-white/[0.06] p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            Founder CV
          </p>
          <div className="mt-3 space-y-2">
            <div className="h-2 w-3/4 rounded bg-surface-elevated" />
            <div className="h-2 w-full rounded bg-surface-elevated" />
            <div className="h-2 w-5/6 rounded bg-surface-elevated" />
            <div className="mt-4 h-2 w-1/2 rounded bg-linear-accent/40" />
            <div className="h-2 w-full rounded bg-surface-elevated" />
            <div className="h-2 w-4/5 rounded bg-surface-elevated" />
            <div className="mt-4 h-2 w-2/3 rounded bg-surface-elevated" />
            <div className="h-2 w-full rounded bg-surface-elevated" />
          </div>
        </div>

        {/* Feedback pane */}
        <div className="col-span-2 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            Review score
          </p>
          <p className="mt-1 font-semibold text-text-primary">
            74<span className="text-sm text-text-muted">/100</span>
          </p>
          <ul className="mt-4 space-y-2">
            {FEEDBACK.map((item) => (
              <li
                key={item.text}
                className="flex items-start gap-1.5 text-[10px] leading-snug text-text-secondary"
              >
                {item.status === "pass" ? (
                  <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-linear-accent" />
                ) : (
                  <AlertCircle className="mt-0.5 size-3 shrink-0 text-amber-400" />
                )}
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProductFrame>
  );
}
