import type { Venue } from "@/lib/types/wedding";
import { getGoogleMapsEmbedUrl } from "@/lib/helpers/getGoogleMapsEmbedUrl";

type EventMapProps = {
  venue: Venue;
  apiKey?: string;
};

/**
 * Map embed driven entirely by venue coordinates from the data source.
 * When an admin (or config edit) changes lat/lng, the pin and embed URL
 * update on the next page load — no component or embed-code changes needed.
 * This is the "live invite" architecture: UI reads coordinates, never hardcodes maps.
 */
export const EventMap = ({ venue, apiKey }: EventMapProps) => {
  if (!apiKey) {
    return (
      <div className="flex h-48 items-center justify-center bg-primary/5 text-sm text-muted sm:h-56">
        <p>
          Map unavailable — add{" "}
          <code className="rounded bg-primary/10 px-1">GOOGLE_MAPS_API_KEY</code> to
          enable live venue maps
        </p>
      </div>
    );
  }

  const embedUrl = getGoogleMapsEmbedUrl(venue, apiKey);

  return (
    <div className="relative h-48 w-full sm:h-56">
      <iframe
        title={`Map showing ${venue.name}`}
        src={embedUrl}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
};
