"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ThemeProvider } from "@/components/design-system/ThemeProvider";
import { LoadingScreen } from "@/components/design-system/LoadingScreen";
import { PageEntrance } from "@/components/design-system/PageEntrance";
import { OurStory } from "@/components/sections/OurStory";
import { CountdownTimer, EventSchedule } from "@/components/sections/CountdownAndSchedule";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { RsvpForm } from "@/components/sections/RsvpForm";
import { Footer } from "@/components/sections/Footer";
import { getCoupleDisplayName } from "@/lib/helpers/getCoupleDisplayName";
import { getCoupleInitials } from "@/lib/helpers/getCoupleInitials";
import type { WeddingConfig } from "@/lib/types/wedding";

type DetailsPageClientProps = {
  data: WeddingConfig;
  mapsApiKey?: string;
};

export const DetailsPageClient = ({ data, mapsApiKey }: DetailsPageClientProps) => {
  const coupleName = getCoupleDisplayName(data.couple);
  const initials = getCoupleInitials(data.couple);

  const imageUrls = useMemo(
    () => data.gallery.images.map((img) => img.src),
    [data.gallery.images]
  );

  return (
    <ThemeProvider theme={data.hero.theme}>
      <LoadingScreen
        initials={initials}
        coupleName={coupleName}
        imageUrls={imageUrls}
        onLoadingComplete={() => {}}
      />

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-accent/15 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <Link
            href="/"
            className="font-serif text-sm text-primary transition-colors hover:text-accent"
          >
            ← {coupleName}
          </Link>
          <nav className="flex gap-4 text-xs uppercase tracking-wider text-muted">
            <a href="#events" className="hover:text-primary">Events</a>
            <a href="#gallery" className="hover:text-primary">Gallery</a>
            <a href="#rsvp" className="hover:text-primary">RSVP</a>
          </nav>
        </div>
      </header>

      <main className="pt-14">
        <PageEntrance>
          <CountdownTimer events={data.events} />
          <OurStory story={data.story} />
          <EventSchedule events={data.events} mapsApiKey={mapsApiKey} />
          <PhotoGallery images={data.gallery.images} />
          <RsvpForm events={data.events} />
          <Footer brand={data.brand} />
        </PageEntrance>
      </main>
    </ThemeProvider>
  );
};
