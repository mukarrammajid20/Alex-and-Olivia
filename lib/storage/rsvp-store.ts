import type { RsvpSubmission } from "@/lib/types/wedding";
import type { RsvpFormData } from "@/lib/validations/rsvp";
import { jsonRsvpStore } from "./json-rsvp-store";
import { prismaRsvpStore } from "./prisma-rsvp-store";

export type RsvpStore = {
  create: (data: RsvpFormData, ipAddress?: string) => Promise<RsvpSubmission>;
  getAll: () => Promise<RsvpSubmission[]>;
  findByContact: (contact: string) => Promise<RsvpSubmission | null>;
};

/**
 * Returns the active RSVP store.
 * Set DATABASE_URL to switch from JSON file storage to Postgres via Prisma.
 */
export const getRsvpStore = (): RsvpStore =>
  process.env.DATABASE_URL ? prismaRsvpStore : jsonRsvpStore;
