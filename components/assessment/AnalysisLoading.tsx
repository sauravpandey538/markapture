"use client";

import { TimelineLoader } from "@/components/assessment/TimelineLoader";
import { getRouteById, type GtRouteId } from "@/lib/assessment";

type Props = {
  routeId: GtRouteId;
};

/** Timeline loader while deep research assessment runs */
export function AnalysisLoading({ routeId }: Props) {
  const route = getRouteById(routeId);

  return (
    <TimelineLoader
      title="Building your assessment"
      subtitle={`${route.label} · Deep research`}
      badge="Deep research"
      stepDuration={3200}
      footer="Deep research with web search — usually 30–60 seconds"
      steps={[
        {
          id: "merge",
          title: "Combining CV + your answers",
          description:
            "Merging resume data with your targeted responses — no duplicate inputs.",
          detail: "Stage 1 endorsement inputs: CV, personal statement, and 3 letters of recommendation.",
        },
        {
          id: "research",
          title: "Deep research — web sources",
          description:
            "Searching Reddit, gov.uk, forums, and guides for relevant resources.",
          detail: "Searching Reddit, gov.uk, Tech Nation guides, and community case studies…",
        },
        {
          id: "criteria",
          title: "Scoring against endorser criteria",
          description: `Mapping strengths and gaps to ${route.endorser} rubric.`,
          detail:
            route.id === "digital-technology"
              ? "Innovation · Recognition beyond occupation · Technical contribution · UK plan"
              : `Applying ${route.endorser} mandatory and optional criteria to your profile.`,
        },
        {
          id: "strengths",
          title: "Identifying strengths & gaps",
          description:
            "Highlighting what's endorsement-ready and what needs work.",
          detail: "Exceptional Talent vs Exceptional Promise — which route fits your evidence?",
        },
        {
          id: "timeline",
          title: "Building your preparation plan",
          description:
            "Creating prioritised next steps and a week-by-week timeline.",
          detail: "Prioritising referee outreach, evidence gathering, and UK plan drafting.",
        },
      ]}
    />
  );
}
