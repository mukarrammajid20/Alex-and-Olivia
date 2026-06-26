"use client";

import { useMemo } from "react";
import { ThemeProvider } from "@/components/design-system/ThemeProvider";
import { LoadingScreen } from "@/components/design-system/LoadingScreen";
import { Hero } from "@/components/sections/Hero";
import { getCoupleDisplayName } from "@/lib/helpers/getCoupleDisplayName";
import { getCoupleInitials } from "@/lib/helpers/getCoupleInitials";
import type { WeddingConfig } from "@/lib/types/wedding";

type HeroPageClientProps = {
  data: WeddingConfig;
};

export const HeroPageClient = ({ data }: HeroPageClientProps) => {
  const coupleName = getCoupleDisplayName(data.couple);
  const initials = getCoupleInitials(data.couple);

  const imageUrls = useMemo(
    () => [data.hero.backgroundImage],
    [data.hero.backgroundImage]
  );

  return (
    <ThemeProvider theme={data.hero.theme}>
      <LoadingScreen
        initials={initials}
        coupleName={coupleName}
        imageUrls={imageUrls}
        onLoadingComplete={() => {}}
      />

      <main>
        <Hero data={data} />
      </main>
    </ThemeProvider>
  );
};
