"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Monogram } from "@/components/design-system/Monogram";
import { StaggeredText } from "@/components/design-system/StaggeredText";
import { formatWeddingDate } from "@/lib/helpers/formatWeddingDate";
import type { WeddingConfig } from "@/lib/types/wedding";
import { getCoupleDisplayName } from "@/lib/helpers/getCoupleDisplayName";
import { getCoupleInitials } from "@/lib/helpers/getCoupleInitials";

type HeroProps = {
  data: Pick<WeddingConfig, "couple" | "weddingDate" | "tagline" | "hero">;
};

export const Hero = ({ data }: HeroProps) => {
  const coupleName = getCoupleDisplayName(data.couple);
  const initials = getCoupleInitials(data.couple);

  return (
    <section className="relative flex min-h-[100dvh] min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      {/* CSS background: object-contain behaviour without stretch; z-0 stays above section fill */}
      <div
        className="absolute inset-0 z-0 bg-background bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${data.hero.backgroundImage}")` }}
        role="img"
        aria-label="Wedding invitation artwork"
      />

      <div className="relative z-10 flex max-w-xs flex-col items-center sm:max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <Monogram
            initials={initials}
            size="md"
            className="mb-5 border-accent/80 bg-background/60 text-primary backdrop-blur-[2px]"
            animate={false}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.4em" }}
          animate={{ opacity: 1, letterSpacing: "0.25em" }}
          transition={{ delay: 0.35, duration: 1 }}
          className="mb-3 text-[0.6rem] uppercase text-muted sm:text-[0.65rem]"
        >
          {data.tagline}
        </motion.p>

        <StaggeredText
          text={coupleName}
          as="h1"
          delay={0.5}
          className="font-serif text-3xl leading-tight text-primary sm:text-4xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-4 font-serif text-base text-foreground/80 sm:text-lg"
        >
          {formatWeddingDate(data.weddingDate)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-8"
        >
          <Link href="/details">
            <motion.span
              className="group relative inline-flex items-center gap-2 rounded-full border-2 border-primary bg-background/95 px-8 py-3 text-xs uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur-sm"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{data.hero.ctaText}</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                aria-hidden="true"
              >
                →
              </motion.span>
            </motion.span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-muted/50 p-1">
          <motion.div
            className="h-1.5 w-0.5 rounded-full bg-accent"
            animate={{ y: [0, 10, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};
