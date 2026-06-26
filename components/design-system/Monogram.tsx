"use client";

import { motion } from "framer-motion";

type MonogramProps = {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
};

const sizeClasses = {
  sm: "text-3xl w-16 h-16",
  md: "text-4xl w-20 h-20",
  lg: "text-5xl w-28 h-28",
  xl: "text-6xl w-36 h-36",
};

const classNameFor = (size: MonogramProps["size"], className: string) =>
  `flex items-center justify-center rounded-full border-2 border-accent/60 font-serif text-primary ${sizeClasses[size ?? "md"]} ${className}`;

export const Monogram = ({
  initials,
  size = "md",
  className = "",
  animate = true,
}: MonogramProps) => {
  if (!animate) {
    return (
      <div className={classNameFor(size, className)} aria-label={`Monogram ${initials}`}>
        {initials}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={classNameFor(size, className)}
      aria-label={`Monogram ${initials}`}
    >
      {initials}
    </motion.div>
  );
};
