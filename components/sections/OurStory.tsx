"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system/Section";
import { SectionHeading } from "@/components/design-system/SectionHeading";
import type { WeddingConfig } from "@/lib/types/wedding";

type OurStoryProps = {
  story: WeddingConfig["story"];
};

export const OurStory = ({ story }: OurStoryProps) => {
  if (!story.enabled) return null;

  const sentences = story.content.split(/(?<=[.!?])\s+/);

  return (
    <Section id="story" className="bg-background">
      <SectionHeading title={story.title} />
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        {sentences.map((sentence, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="text-base leading-relaxed text-muted sm:text-lg"
          >
            {sentence}
          </motion.p>
        ))}
      </div>
    </Section>
  );
};
