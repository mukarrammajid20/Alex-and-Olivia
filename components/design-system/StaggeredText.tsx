"use client";

import { motion } from "framer-motion";

type StaggeredTextProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "p" | "span";
};

export const StaggeredText = ({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
}: StaggeredTextProps) => {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 24, rotateX: 40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: delay + i * 0.12,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
};
