"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

/** Gate demo loops — only run when the mock is in the viewport */
export function useDemoInView(amount = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount,
    margin: "0px 0px -48px 0px",
  });

  return { ref, isInView };
}
