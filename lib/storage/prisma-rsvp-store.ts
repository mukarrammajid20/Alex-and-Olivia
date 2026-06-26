import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import type { RsvpStore } from "./rsvp-store";
import type { RsvpFormData } from "@/lib/validations/rsvp";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const prismaRsvpStore: RsvpStore = {
  create: async (data: RsvpFormData, ipAddress?: string) => {
    const submission = await prisma.rsvp.create({
      data: {
        id: randomUUID(),
        guestName: data.guestName,
        contact: data.contact,
        guestCount: data.guestCount,
        eventsAttending: data.eventsAttending,
        dietaryRestrictions: data.dietaryRestrictions || null,
        message: data.message || null,
        ipAddress: ipAddress ?? null,
      },
    });
    return {
      id: submission.id,
      guestName: submission.guestName,
      contact: submission.contact,
      guestCount: submission.guestCount,
      eventsAttending: submission.eventsAttending,
      dietaryRestrictions: submission.dietaryRestrictions ?? undefined,
      message: submission.message ?? undefined,
      submittedAt: submission.submittedAt.toISOString(),
      ipAddress: submission.ipAddress ?? undefined,
    };
  },
  getAll: async () => {
    const submissions = await prisma.rsvp.findMany({
      orderBy: { submittedAt: "desc" },
    });
    return submissions.map((s) => ({
      id: s.id,
      guestName: s.guestName,
      contact: s.contact,
      guestCount: s.guestCount,
      eventsAttending: s.eventsAttending,
      dietaryRestrictions: s.dietaryRestrictions ?? undefined,
      message: s.message ?? undefined,
      submittedAt: s.submittedAt.toISOString(),
      ipAddress: s.ipAddress ?? undefined,
    }));
  },
  findByContact: async (contact: string) => {
    const submission = await prisma.rsvp.findFirst({
      where: { contact: { equals: contact, mode: "insensitive" } },
    });
    if (!submission) return null;
    return {
      id: submission.id,
      guestName: submission.guestName,
      contact: submission.contact,
      guestCount: submission.guestCount,
      eventsAttending: submission.eventsAttending,
      dietaryRestrictions: submission.dietaryRestrictions ?? undefined,
      message: submission.message ?? undefined,
      submittedAt: submission.submittedAt.toISOString(),
      ipAddress: submission.ipAddress ?? undefined,
    };
  },
};
