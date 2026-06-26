"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Section } from "@/components/design-system/Section";
import { SectionHeading } from "@/components/design-system/SectionHeading";
import { getSwipeDirection } from "@/lib/helpers/getSwipeDirection";
import type { GalleryImage } from "@/lib/types/wedding";

type PhotoGalleryProps = {
  images: GalleryImage[];
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export const PhotoGallery = ({ images }: PhotoGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      const nextIndex = (index + images.length) % images.length;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(nextIndex);
    },
    [currentIndex, images.length]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const swipe = getSwipeDirection(info.offset.x);
      if (swipe === "left") goNext();
      else if (swipe === "right") goPrev();
    },
    [goNext, goPrev]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <Section id="gallery" className="bg-primary/5">
      <SectionHeading title="Our Moments" subtitle="A glimpse into our journey together" />

      <div className="mx-auto max-w-2xl">
        <div
          className="relative overflow-hidden rounded-2xl border border-accent/20 bg-background shadow-sm"
          aria-roledescription="carousel"
          aria-label="Photo gallery"
        >
          <div className="relative aspect-[3/4] w-full sm:aspect-[4/5]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  priority={currentIndex === 0}
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="pointer-events-none select-none object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 text-primary shadow-md backdrop-blur-sm transition hover:bg-background"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 text-primary shadow-md backdrop-blur-sm transition hover:bg-background"
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to photo ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        )}

        <p className="mt-3 text-center text-sm text-muted">{currentImage.alt}</p>
      </div>
    </Section>
  );
};
