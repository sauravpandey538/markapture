"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ProductFrameProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

/** Linear-style product frame — fades in when scrolled into viewport */
export const ProductFrame = forwardRef<HTMLDivElement, ProductFrameProps>(
  function ProductFrame({ children, className, title }, ref) {
    return (
      <motion.div
        ref={ref}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className={cn("product-glow overflow-hidden rounded-lg bg-surface", className)}
      >
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
      </motion.div>
    );
  }
);
