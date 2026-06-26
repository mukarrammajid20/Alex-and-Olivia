"use client";

import { motion } from "framer-motion";

type PageEntranceProps = {
  children: React.ReactNode;
};

export const PageEntrance = ({ children }: PageEntranceProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
  >
    {children}
  </motion.div>
);
