import { CheckCircle2, Route } from "lucide-react";
import { ProductFrame } from "@/components/product/ProductFrame";

/** Mock eligibility / route finder UI for landing page */
export function EligibilityCheckerMock() {
  return (
    <ProductFrame title="markapture — route finder">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-text-muted">Assessment</p>
            <p className="text-sm font-medium text-text-primary">
              Route eligibility
            </p>
          </div>
          <span className="rounded bg-linear-accent-muted px-2 py-0.5 text-[10px] font-medium text-linear-accent">
            In review
          </span>
        </div>

        <div className="space-y-2">
          <RouteCard
            route="Global Talent"
            score={72}
            recommended={false}
            items={["Publications mapped", "Referees pending"]}
          />
          <RouteCard
            route="Innovator Founder"
            score={89}
            recommended
            items={["Innovation thesis strong", "UK market plan ready"]}
          />
        </div>

        <div className="mt-4 rounded-md bg-surface-elevated p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">
            Recommendation
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Innovator Founder aligns better with your traction and team
            structure. 4 evidence gaps to resolve before filing.
          </p>
        </div>
      </div>
    </ProductFrame>
  );
}

function RouteCard({
  route,
  score,
  recommended,
  items,
}: {
  route: string;
  score: number;
  recommended?: boolean;
  items: string[];
}) {
  return (
    <div
      className={`rounded-md p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] ${
        recommended ? "bg-linear-accent-muted" : "bg-surface-elevated"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Route className="size-3.5 text-linear-accent" />
          <span className="text-xs font-medium text-text-primary">{route}</span>
        </div>
        <span className="text-xs font-semibold text-text-primary">{score}%</span>
      </div>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-1.5 text-[10px] text-text-secondary"
          >
            <CheckCircle2 className="size-3 text-linear-accent" />
            {item}
          </li>
        ))}
      </ul>
      {recommended && (
        <p className="mt-2 text-[10px] font-medium text-linear-accent">
          Recommended route
        </p>
      )}
    </div>
  );
}
