"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

export const Section = ({
  id,
  children,
  className = "",
  containerClassName = "",
}: SectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 48, filter: "blur(6px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 48, filter: "blur(6px)" }
      }
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={`px-5 py-16 sm:px-8 sm:py-20 md:py-24 ${className}`}
    >
      <div className={`mx-auto w-full max-w-4xl ${containerClassName}`}>
        {children}
      </div>
    </motion.section>
  );
};
