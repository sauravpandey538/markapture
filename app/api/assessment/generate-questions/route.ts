import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAssessmentQuestions } from "@/lib/openrouter";
import { extractResumeText } from "@/lib/resume-extract";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const requestSchema = z.object({
  routeId: z.enum([
    "digital-technology",
    "science-research",
    "arts-culture",
    "academia",
  ]),
});

export const runtime = "nodejs";

/** Parses resume and generates personalised follow-up questions via LLM */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const routeId = formData.get("routeId");
    const resume = formData.get("resume");

    const { routeId: parsedRouteId } = requestSchema.parse({ routeId });

    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ error: "Resume is required" }, { status: 400 });
    }

    if (resume.size > MAX_RESUME_SIZE) {
      return NextResponse.json(
        { error: "Resume must be under 5 MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await resume.arrayBuffer());
    const resumeText = await extractResumeText(buffer, resume.name);

    const generated = await generateAssessmentQuestions(
      parsedRouteId,
      resumeText
    );

    return NextResponse.json(generated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    console.error("[Generate Questions]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (message.includes("OPENROUTER_API_KEY")) {
      return NextResponse.json(
        { error: "Assessment service is not configured." },
        { status: 503 }
      );
    }

    if (message.includes("extract") || message.includes("resume")) {
      return NextResponse.json(
        {
          error:
            "Could not read your resume. Try a text-based PDF or .docx file.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
