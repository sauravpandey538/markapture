import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerStory } from "@/lib/constants";
import { IMAGE_QUALITY } from "@/lib/images";

type CustomerCardProps = CustomerStory & {
  className?: string;
  featured?: boolean;
};

export function CustomerCard({
  slug,
  name,
  role,
  route,
  field,
  avatar,
  quote,
  metric,
  metricLabel,
  featured,
  className,
}: CustomerCardProps) {
  return (
    <Link
      href={`/customers/${slug}`}
      className={cn(
        "group surface-card block transition-all hover:shadow-[0_4px_32px_rgba(94,106,210,0.12)]",
        featured && "md:col-span-2",
        className
      )}
    >
      <div className={cn("p-6", featured && "md:flex md:gap-8 md:p-8")}>
        {featured && (
          <div className="relative mb-4 size-14 shrink-0 overflow-hidden rounded-full md:mb-0">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
              sizes="56px"
              quality={IMAGE_QUALITY}
            />
          </div>
        )}
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded bg-linear-accent-muted px-2 py-0.5 text-[10px] font-medium text-linear-accent">
              {route}
            </span>
            <span className="text-[10px] text-text-muted">{field}</span>
          </div>
          <p
            className={cn(
              "text-text-primary",
              featured
                ? "text-lg font-medium leading-snug"
                : "text-sm leading-snug"
            )}
          >
            {quote}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-primary">{name}</p>
              <p className="text-[11px] text-text-muted">{role}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary">{metric}</p>
              <p className="text-[10px] text-text-muted">{metricLabel}</p>
            </div>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-xs text-text-secondary transition-colors group-hover:text-linear-accent">
            Read story
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
