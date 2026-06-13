import { NextResponse } from "next/server";
import { z } from "zod";
import {
  evidenceReviewRequestSchema,
  getEvidenceOption,
  getTechNationCriterion,
} from "@/lib/evidence-review";
import { reviewTechNationEvidence } from "@/lib/openrouter";
import { extractResumeText } from "@/lib/resume-extract";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_EVIDENCE_TEXT = 16_000;

export const runtime = "nodejs";
export const maxDuration = 60;

/** Reviews uploaded Tech Nation evidence against criterion-specific rubric */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const criterionId = formData.get("criterionId");
    const evidenceIdsRaw = formData.get("evidenceIds");

    if (typeof criterionId !== "string" || typeof evidenceIdsRaw !== "string") {
      return NextResponse.json(
        { error: "Missing criterion or evidence selection" },
        { status: 400 }
      );
    }

    let evidenceIds: string[];
    try {
      evidenceIds = JSON.parse(evidenceIdsRaw) as string[];
    } catch {
      return NextResponse.json(
        { error: "Invalid evidenceIds JSON" },
        { status: 400 }
      );
    }

    const parsed = evidenceReviewRequestSchema.parse({ criterionId, evidenceIds });
    const criterion = getTechNationCriterion(parsed.criterionId);

    if (!criterion) {
      return NextResponse.json(
        { error: "Unknown criterion section" },
        { status: 400 }
      );
    }

    const uploads = [];

    for (const evidenceId of parsed.evidenceIds) {
      const file = formData.get(`file_${evidenceId}`);
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json(
          { error: `Missing file for evidence: ${evidenceId}` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${file.name} exceeds 5 MB limit` },
          { status: 400 }
        );
      }

      const option = getEvidenceOption(parsed.criterionId, evidenceId);
      if (!option) {
        return NextResponse.json(
          { error: `Invalid evidence type: ${evidenceId}` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      let text: string;

      try {
        text = await extractResumeText(buffer, file.name);
      } catch (extractError) {
        const message =
          extractError instanceof Error
            ? extractError.message
            : "Could not read file";
        return NextResponse.json({ error: message }, { status: 400 });
      }

      uploads.push({
        evidenceId,
        fileName: file.name,
        text: text.slice(0, MAX_EVIDENCE_TEXT),
        template: option.template,
      });
    }

    const result = await reviewTechNationEvidence({
      criterionId: parsed.criterionId,
      uploads,
    });

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("[EvidenceReview]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (message.includes("OPENROUTER_API_KEY")) {
      return NextResponse.json(
        { error: "Review service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    if (message.includes("402") || message.includes("credits")) {
      return NextResponse.json(
        {
          error:
            "Review service is temporarily unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
