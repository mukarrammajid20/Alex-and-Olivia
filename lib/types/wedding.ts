export type Coordinates = {
  lat: number;
  lng: number;
};

export type Venue = {
  name: string;
  address: string;
} & Coordinates;

export type WeddingEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: Venue;
};

export type ThemeColors = {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type WeddingConfig = {
  couple: {
    partner1: string;
    partner2: string;
  };
  weddingDate: string;
  tagline: string;
  story: {
    enabled: boolean;
    title: string;
    content: string;
  };
  events: WeddingEvent[];
  theme: ThemeColors;
  hero: {
    backgroundImage: string;
    ctaText: string;
    theme: ThemeColors;
  };
  gallery: {
    images: GalleryImage[];
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  brand: {
    name: string;
  };
};

export type RsvpSubmission = {
  id: string;
  guestName: string;
  contact: string;
  guestCount: number;
  eventsAttending: string[];
  dietaryRestrictions?: string;
  message?: string;
  submittedAt: string;
  ipAddress?: string;
};
