import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EndorsementCta } from "@/components/ui/EndorsementCta";
import { CUSTOMER_STORIES } from "@/lib/constants";
import { IMAGE_QUALITY } from "@/lib/images";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return CUSTOMER_STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = CUSTOMER_STORIES.find((s) => s.slug === slug);
  if (!story) return { title: "Story not found" };
  return {
    title: `${story.name} — ${story.route} | Markapture Customers`,
    description: story.quote,
  };
}

export default async function CustomerStoryPage({ params }: Props) {
  const { slug } = await params;
  const story = CUSTOMER_STORIES.find((s) => s.slug === slug);
  if (!story) notFound();

  return (
    <article className="page-container py-20 md:py-28">
      <Link
        href="/customers"
        className="mb-10 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="size-4" />
        All customers
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded bg-linear-accent-muted px-2.5 py-1 text-xs font-medium text-linear-accent">
          {story.route}
        </span>
        <span className="text-sm text-text-muted">{story.field}</span>
      </div>

      <blockquote className="mt-8 text-2xl font-medium leading-snug tracking-tight text-text-primary md:text-3xl">
        &ldquo;{story.quote}&rdquo;
      </blockquote>

      <div className="mt-10 flex items-center gap-4">
        <div className="relative size-14 overflow-hidden rounded-full">
          <Image
            src={story.avatar}
            alt={story.name}
            fill
            className="object-cover"
            sizes="56px"
            quality={IMAGE_QUALITY}
          />
        </div>
        <div>
          <p className="font-medium text-text-primary">{story.name}</p>
          <p className="text-sm text-text-muted">
            {story.role} · {story.country}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xl font-semibold text-text-primary">
            {story.metric}
          </p>
          <p className="text-xs text-text-muted">{story.metricLabel}</p>
        </div>
      </div>

      <div className="mt-20 space-y-16">
        <StorySection title="The challenge" content={story.challenge} />
        <StorySection title="Our approach" content={story.approach} />
        <StorySection title="Outcome" content={story.outcome} />
      </div>

      <EndorsementCta />
    </article>
  );
}

function StorySection({ title, content }: { title: string; content: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      <SectionHeader title={title} className="lg:pt-1" />
      <p className="max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">
        {content}
      </p>
    </div>
  );
}
