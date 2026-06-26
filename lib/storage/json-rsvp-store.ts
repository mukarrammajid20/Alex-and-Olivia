import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isServerlessReadOnlyFilesystem } from "@/lib/helpers/isServerlessReadOnlyFilesystem";
import type { RsvpSubmission } from "@/lib/types/wedding";
import type { RsvpStore } from "./rsvp-store";

const RSVP_FILE = path.join(process.cwd(), "data", "rsvps.json");

const canPersistRsvps = (): boolean => !isServerlessReadOnlyFilesystem();

const ensureRsvpFile = async (): Promise<boolean> => {
  if (!canPersistRsvps()) {
    return false;
  }

  try {
    await fs.access(RSVP_FILE);
    return true;
  } catch {
    try {
      await fs.mkdir(path.dirname(RSVP_FILE), { recursive: true });
      await fs.writeFile(RSVP_FILE, "[]", "utf-8");
      return true;
    } catch {
      return false;
    }
  }
};

const readRsvps = async (): Promise<RsvpSubmission[]> => {
  if (!canPersistRsvps()) {
    return [];
  }

  const ready = await ensureRsvpFile();
  if (!ready) {
    return [];
  }

  const raw = await fs.readFile(RSVP_FILE, "utf-8").catch(() => "[]");
  try {
    return JSON.parse(raw) as RsvpSubmission[];
  } catch {
    return [];
  }
};

const writeRsvps = async (rsvps: RsvpSubmission[]): Promise<void> => {
  if (!canPersistRsvps()) {
    throw new Error(
      "RSVP submissions cannot be saved without DATABASE_URL on serverless hosting."
    );
  }

  const ready = await ensureRsvpFile();
  if (!ready) {
    throw new Error("Unable to persist RSVP submissions to disk.");
  }

  await fs.writeFile(RSVP_FILE, JSON.stringify(rsvps, null, 2), "utf-8");
};

export const jsonRsvpStore: RsvpStore = {
  create: async (data, ipAddress) => {
    const rsvps = await readRsvps();
    const submission: RsvpSubmission = {
      id: randomUUID(),
      guestName: data.guestName,
      contact: data.contact,
      guestCount: data.guestCount,
      eventsAttending: data.eventsAttending,
      dietaryRestrictions: data.dietaryRestrictions || undefined,
      message: data.message || undefined,
      submittedAt: new Date().toISOString(),
      ipAddress,
    };
    rsvps.push(submission);
    await writeRsvps(rsvps);
    return submission;
  },
  getAll: readRsvps,
  findByContact: async (contact) => {
    const rsvps = await readRsvps();
    return rsvps.find((r) => r.contact.toLowerCase() === contact.toLowerCase()) ?? null;
  },
};
