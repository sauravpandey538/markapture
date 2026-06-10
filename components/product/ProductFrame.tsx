import { cn } from "@/lib/utils";

type ProductFrameProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

/** Linear-style product screenshot frame with purple glow */
export function ProductFrame({ children, className, title }: ProductFrameProps) {
  return (
    <div className={cn("product-glow overflow-hidden rounded-lg bg-surface", className)}>
      {title && (
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-surface-elevated px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 text-[11px] text-text-muted">{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}
