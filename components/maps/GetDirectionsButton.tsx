import type { Venue } from "@/lib/types/wedding";
import { getGoogleMapsDirectionsUrl } from "@/lib/helpers/getGoogleMapsDirectionsUrl";

type GetDirectionsButtonProps = {
  venue: Venue;
};

export const GetDirectionsButton = ({ venue }: GetDirectionsButtonProps) => (
  <a
    href={getGoogleMapsDirectionsUrl(venue)}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-2 text-sm text-primary transition-colors hover:bg-primary/5"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
    Get Directions
  </a>
);
