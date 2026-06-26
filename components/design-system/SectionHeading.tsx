"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
};

export const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
  <div className="mb-10 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="font-serif text-3xl text-primary sm:text-4xl"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mt-3 text-sm text-muted sm:text-base"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="mx-auto mt-4 h-px w-16 origin-center bg-accent/60"
    />
  </div>
);
