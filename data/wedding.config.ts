import type { WeddingConfig } from "@/lib/types/wedding";

/**
 * Default wedding configuration — seed data for first run.
 * At runtime, persisted data in wedding-data.json takes precedence.
 * Admin edits update the persisted store, not this file.
 */
export const weddingConfig: WeddingConfig = {
  couple: {
    partner1: "Alex",
    partner2: "Olivia",
  },
  weddingDate: "2026-12-15",
  tagline: "Together with their families, invite you to celebrate their union",
  story: {
    enabled: true,
    title: "Our Story",
    content:
      "We met on a rainy afternoon in Lahore and knew something special had begun. After years of laughter, adventures, and quiet moments together, we are thrilled to begin this new chapter surrounded by the people we love most.",
  },
  events: [
    {
      id: "rehearsal-dinner",
      name: "Rehearsal Dinner",
      date: "2026-12-14",
      time: "18:00",
      venue: {
        name: "The Oak Room",
        address: "1245 Vineyard Lane, Napa, CA 94558, USA",
        lat: 38.2975,
        lng: -122.2869,
      },
    },
    {
      id: "ceremony",
      name: "Wedding Ceremony",
      date: "2026-12-15",
      time: "15:00",
      venue: {
        name: "Rose Garden Chapel",
        address: "2100 Silverado Trail, Napa, CA 94558, USA",
        lat: 38.324,
        lng: -122.265,
      },
    },
    {
      id: "reception",
      name: "Wedding Reception",
      date: "2026-12-15",
      time: "18:00",
      venue: {
        name: "The Estate Ballroom",
        address: "875 Main Street, Napa, CA 94559, USA",
        lat: 38.2971,
        lng: -122.2856,
      },
    },
  ],
  theme: {
    primary: "#2F3E2F",
    accent: "#8A9A8A",
    background: "#F2F2F0",
    foreground: "#333333",
    muted: "#6B7B6B",
  },
  hero: {
    backgroundImage: "/gallery/hero-bg.webp",
    ctaText: "Open Invitation",
    theme: {
      primary: "#2F3E2F",
      accent: "#8A9A8A",
      background: "#F2F2F0",
      foreground: "#333333",
      muted: "#6B7B6B",
    },
  },
  gallery: {
    images: [
      { src: "/gallery/moment-1.png", alt: "Alex and Olivia in an open field at golden hour" },
      { src: "/gallery/moment-2.png", alt: "Alex and Olivia leaning against a vintage pickup truck" },
      { src: "/gallery/moment-3.png", alt: "Alex and Olivia walking through a field of wildflowers" },
      { src: "/gallery/moment-4.png", alt: "Alex and Olivia embracing at sunset" },
      { src: "/gallery/moment-5.png", alt: "Alex and Olivia in a western field at dusk" },
    ],
  },
  seo: {
    title: "Alex & Olivia — Wedding Invitation",
    description:
      "You are cordially invited to celebrate the wedding of Alex and Olivia. View event details, RSVP, and find directions.",
    ogImage: "/gallery/moment-1.png",
  },
  brand: {
    name: "Aura Invites",
  },
};
