"use client";

import { TimelineLoader } from "@/components/assessment/TimelineLoader";
import { getRouteById, type GtRouteId } from "@/lib/assessment";

type Props = {
  routeId: GtRouteId;
};

/** Timeline loader while LLM reads CV and generates follow-up questions */
export function QuestionGeneratingLoader({ routeId }: Props) {
  const route = getRouteById(routeId);

  return (
    <TimelineLoader
      title="Reading your CV"
      subtitle={`Step 2 · ${route.label}`}
      badge="Analysing resume"
      stepDuration={2400}
      footer="Usually 10–20 seconds — we're only asking what your CV doesn't cover"
      steps={[
        {
          id: "parse",
          title: "Extracting resume text",
          description:
            "Parsing your PDF or Word document into structured content.",
          detail: "Pulling roles, dates, skills, and achievements from your document…",
        },
        {
          id: "map",
          title: "Mapping to endorser criteria",
          description: `Checking fit against ${route.endorser} requirements.`,
          detail:
            route.id === "digital-technology"
              ? "Tech Nation: innovation, recognition, contribution, and UK plan signals"
              : `${route.endorser} endorsement mandatory criteria`,
        },
        {
          id: "gaps",
          title: "Identifying information gaps",
          description:
            "Finding what's missing from your CV — UK plan, referees, timeline, evidence.",
          detail: "Skipping education & job history already on your CV…",
        },
        {
          id: "questions",
          title: "Crafting personalised questions",
          description:
            "Generating only the questions you need to answer — no repetition.",
          detail: "Preparing 5–8 Global Talent Visa intake questions for endorsement prep.",
        },
      ]}
    />
  );
}
