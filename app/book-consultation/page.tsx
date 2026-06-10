import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ConsultationBookingForm } from "@/components/booking/ConsultationBookingForm";
import { SessionTimeline } from "@/components/booking/SessionTimeline";

export const metadata: Metadata = {
  title: "Book Consultation - Markapture",
  description:
    "Book a free 30-minute consultation for Global Talent or Innovator Founder endorsement preparation.",
};

export default function BookConsultationPage() {
  return (
    <section className="page-container py-16 md:py-24">
      <SectionHeader
        eyebrow="Free consultation"
        title="Book your 30-minute session"
        description="Choose a date, pick an available UK time slot, then share your background. Nabila Farzin will assess your route and outline your preparation path — no visa guarantees, just honest guidance."
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="surface-card p-6 md:p-8">
          <p className="mb-5 text-sm font-medium text-text-primary">
            Reserve your slot
          </p>
          <ConsultationBookingForm />
        </div>

        <div className="lg:sticky lg:top-24">
          <SessionTimeline />
        </div>
      </div>
    </section>
  );
}
