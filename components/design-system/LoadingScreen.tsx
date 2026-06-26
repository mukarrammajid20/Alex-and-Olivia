"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monogram } from "./Monogram";

type LoadingScreenProps = {
  initials: string;
  coupleName: string;
  imageUrls: string[];
  onLoadingComplete: () => void;
};

const MAX_LOADING_MS = 4000;

const preloadImage = (src: string): Promise<void> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

export const LoadingScreen = ({
  initials,
  coupleName,
  imageUrls,
  onLoadingComplete,
}: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAssets = async () => {
      const fontReady =
        typeof document !== "undefined" && document.fonts
          ? document.fonts.ready
          : Promise.resolve();

      const imagesReady = Promise.all(imageUrls.map(preloadImage));

      await Promise.all([fontReady, imagesReady]);
      if (!cancelled) setIsReady(true);
    };

    const fallbackTimer = setTimeout(() => {
      if (!cancelled) setIsReady(true);
    }, MAX_LOADING_MS);

    void loadAssets();

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
    };
  }, [imageUrls]);

  useEffect(() => {
    if (!isReady) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete();
    }, 400);

    return () => clearTimeout(timer);
  }, [isReady, onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          aria-live="polite"
          aria-busy={!isReady}
        >
          <Monogram initials={initials} size="xl" />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 font-serif text-2xl text-primary sm:text-3xl"
          >
            {coupleName}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
