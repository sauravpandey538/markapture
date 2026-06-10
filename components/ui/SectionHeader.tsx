import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

/** Wide headings & descriptions — avoids cramped centered copy */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-2 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]",
          align === "center" ? "mx-auto max-w-5xl" : "max-w-5xl"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed text-text-secondary md:text-lg",
            align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
