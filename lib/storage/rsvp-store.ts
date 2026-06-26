import type { RsvpSubmission } from "@/lib/types/wedding";
import type { RsvpFormData } from "@/lib/validations/rsvp";
import { jsonRsvpStore } from "./json-rsvp-store";

export type RsvpStore = {
  create: (data: RsvpFormData, ipAddress?: string) => Promise<RsvpSubmission>;
  getAll: () => Promise<RsvpSubmission[]>;
  findByContact: (contact: string) => Promise<RsvpSubmission | null>;
};

let cachedPrismaStore: RsvpStore | null = null;

const loadPrismaRsvpStore = async (): Promise<RsvpStore> => {
  if (cachedPrismaStore) {
    return cachedPrismaStore;
  }

  const { prismaRsvpStore } = await import("./prisma-rsvp-store");
  cachedPrismaStore = prismaRsvpStore;
  return cachedPrismaStore;
};

/**
 * Returns the active RSVP store.
 * Set DATABASE_URL to switch from JSON file storage to Postgres via Prisma.
 */
export const getRsvpStore = async (): Promise<RsvpStore> =>
  process.env.DATABASE_URL ? loadPrismaRsvpStore() : jsonRsvpStore;
