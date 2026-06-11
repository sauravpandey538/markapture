import Link from "next/link";
import { cn } from "@/lib/utils";

type CTAButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

/** Linear-style CTA buttons */
export function CTAButton({
  href = "/book-consultation",
  children,
  className,
  onClick,
  type,
  disabled,
  variant = "primary",
}: CTAButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" &&
      "bg-linear-accent text-white hover:bg-linear-accent-hover",
    variant === "secondary" &&
      "bg-surface-elevated text-text-primary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-surface",
    variant === "ghost" &&
      "text-text-secondary hover:text-text-primary",
    className
  );

  if (type === "submit" || type === "button") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={classes}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={classes}>
      {children}
    </Link>
  );
}
