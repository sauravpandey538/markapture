import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { LocationMap } from "@/components/ui/LocationMap";
import { CONTACT_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact - Markapture",
  description: "Get in touch with Markapture for endorsement preparation guidance.",
};

export default function ContactPage() {
  return (
    <section className="page-container py-16 md:py-24">
      <SectionHeader
        title="Contact"
        description="Questions about Global Talent or Innovator Founder preparation? Send a message — we respond within 48 hours. For route assessment, book a consultation instead."
      />

      <div className="mt-16 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card p-8">
          <ContactForm />
        </div>
        <div className="space-y-6">
          <LocationMap />
          <div className="surface-card p-6">
            <p className="mb-4 text-sm font-medium text-text-primary">Direct</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary"
                >
                  <Mail className="size-3.5" />
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary"
                >
                  <Phone className="size-3.5" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <CTAButton href="/book-consultation" variant="secondary" className="text-xs">
                Book a consultation instead
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
