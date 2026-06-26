import type { Coordinates } from "@/lib/types/wedding";

/**
 * Builds a Google Maps embed URL from coordinates and API key.
 * Pin position is derived solely from lat/lng in the data source — changing
 * coordinates in wedding config (or admin panel) moves the pin instantly
 * without touching any component code.
 */
export const getGoogleMapsEmbedUrl = (
  { lat, lng }: Coordinates,
  apiKey: string
): string => {
  const query = encodeURIComponent(`${lat},${lng}`);
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=15`;
};
