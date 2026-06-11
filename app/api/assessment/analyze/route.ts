import { NextResponse } from "next/server";
import { z } from "zod";
import { assessmentRequestSchema, dynamicQuestionSchema } from "@/lib/assessment";
import { analyzeGlobalTalentAssessment } from "@/lib/openrouter";
import { extractResumeText } from "@/lib/resume-extract";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export const runtime = "nodejs";

/** Processes questionnaire + resume via OpenRouter GPT-5.5 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const routeId = formData.get("routeId");
    const answersRaw = formData.get("answers");
    const questionsRaw = formData.get("questions");
    const resume = formData.get("resume");

    if (typeof routeId !== "string" || typeof answersRaw !== "string") {
      return NextResponse.json(
        { error: "Missing route or answers" },
        { status: 400 }
      );
    }

    let answers: Record<string, string>;
    try {
      answers = JSON.parse(answersRaw) as Record<string, string>;
    } catch {
      return NextResponse.json({ error: "Invalid answers JSON" }, { status: 400 });
    }

    let questions;
    if (typeof questionsRaw === "string" && questionsRaw) {
      try {
        questions = z.array(dynamicQuestionSchema).parse(JSON.parse(questionsRaw));
      } catch {
        return NextResponse.json(
          { error: "Invalid questions JSON" },
          { status: 400 }
        );
      }
    }

    const parsed = assessmentRequestSchema.parse({ routeId, answers, questions });

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
    let resumeText: string | undefined;

    try {
      resumeText = await extractResumeText(buffer, resume.name);
    } catch (extractError) {
      console.warn("[Assessment] Resume extraction failed:", extractError);
      // Continue with questionnaire-only if extraction fails
    }

    const result = await analyzeGlobalTalentAssessment({
      routeId: parsed.routeId,
      answers: parsed.answers,
      questions: parsed.questions,
      resumeText,
    });

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("[Assessment]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (message.includes("OPENROUTER_API_KEY")) {
      return NextResponse.json(
        { error: "Assessment service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    if (message.includes("402") || message.includes("credits")) {
      return NextResponse.json(
        {
          error:
            "Assessment service is temporarily unavailable. Please try again later or book a consultation.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
