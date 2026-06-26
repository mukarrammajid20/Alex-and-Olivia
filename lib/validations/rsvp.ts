import { z } from "zod";

export const rsvpSchema = z.object({
  guestName: z
    .string()
    .min(2, "Please enter your full name")
    .max(100, "Name is too long"),
  contact: z
    .string()
    .min(5, "Please enter a valid phone number or email")
    .max(150, "Contact info is too long")
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^[+]?[\d\s()-]{7,}$/.test(value),
      "Please enter a valid phone number or email"
    ),
  guestCount: z
    .number({ error: "Guest count is required" })
    .int("Guest count must be a whole number")
    .min(1, "At least 1 guest is required")
    .max(20, "Please contact us directly for groups larger than 20"),
  eventsAttending: z
    .array(z.string())
    .min(1, "Please select at least one event"),
  dietaryRestrictions: z.string().max(500).optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;
