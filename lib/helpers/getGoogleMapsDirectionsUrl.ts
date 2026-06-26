import type { Coordinates } from "@/lib/types/wedding";

/**
 * Builds a Google Maps directions URL from coordinates.
 * When venue lat/lng changes in the data source, this URL updates automatically —
 * no manual embed code editing required. This is the core "live invite" pattern:
 * components read coordinates from config/store, never hardcode map URLs.
 */
export const getGoogleMapsDirectionsUrl = ({ lat, lng }: Coordinates): string => {
  const destination = encodeURIComponent(`${lat},${lng}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
};
