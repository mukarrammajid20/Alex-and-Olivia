"use client";

import { motion } from "framer-motion";

const ornaments = [
  { size: 6, top: "12%", left: "8%", duration: 7 },
  { size: 4, top: "22%", left: "88%", duration: 9 },
  { size: 5, top: "68%", left: "6%", duration: 8 },
  { size: 3, top: "78%", left: "92%", duration: 6 },
  { size: 4, top: "45%", left: "4%", duration: 10 },
  { size: 5, top: "35%", left: "94%", duration: 7.5 },
];

export const FloatingOrnaments = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {ornaments.map((o, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-accent/30"
        style={{
          width: o.size,
          height: o.size,
          top: o.top,
          left: o.left,
        }}
        animate={{
          y: [0, -18, 0],
          opacity: [0.2, 0.7, 0.2],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: o.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.4,
        }}
      />
    ))}
    <motion.div
      className="absolute left-1/2 top-[18%] h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 1.4, duration: 1.2 }}
    />
    <motion.div
      className="absolute bottom-[22%] left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 1.6, duration: 1.2 }}
    />
  </div>
);
