import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EndorsementCta } from "@/components/ui/EndorsementCta";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { CUSTOMER_STORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Customers - Markapture",
  description:
    "Read how professionals prepared for Global Talent and Innovator Founder endorsements with Markapture.",
};

const featured = CUSTOMER_STORIES.filter((s) => s.featured);
const rest = CUSTOMER_STORIES.filter((s) => !s.featured);

export default function CustomersPage() {
  return (
    <>
      <section className="page-container pb-12 pt-20 md:pt-28">
        <SectionHeader
          title="Customers"
          description="Professionals who prepared for UK endorsement routes with structured guidance. Outcomes vary — visa approval is never guaranteed."
        />
      </section>

      <section className="page-container space-y-4 pb-16">
        {featured.map((story) => (
          <CustomerCard key={story.slug} {...story} featured />
        ))}
      </section>

      <section className="section-band py-16">
        <div className="page-container">
          <p className="mb-8 text-sm text-text-muted">
            More preparation journeys from Global Talent and Innovator Founder
            candidates.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((story) => (
              <CustomerCard key={story.slug} {...story} />
            ))}
          </div>

          <EndorsementCta className="mt-16" />
        </div>
      </section>
    </>
  );
}
