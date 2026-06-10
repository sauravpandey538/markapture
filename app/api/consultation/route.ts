import { NextResponse } from "next/server";
import { z } from "zod";

const consultationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  date: z.string().min(1),
  timeSlot: z.string().min(1),
  description: z.string().min(20),
});

/** Handles consultation booking with resume upload */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const data = consultationSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      date: formData.get("date"),
      timeSlot: formData.get("timeSlot"),
      description: formData.get("description"),
    });

    const resume = formData.get("resume");
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json(
        { error: "Resume is required" },
        { status: 400 }
      );
    }

    // In production, store resume in S3/Cloudinary and send confirmation email
    console.log("[Consultation Booking]", {
      ...data,
      resumeName: resume.name,
      resumeSize: resume.size,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
