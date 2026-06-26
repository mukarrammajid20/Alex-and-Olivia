"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/design-system/Section";
import { SectionHeading } from "@/components/design-system/SectionHeading";
import { rsvpSchema, type RsvpFormData } from "@/lib/validations/rsvp";
import type { WeddingEvent } from "@/lib/types/wedding";

type RsvpFormProps = {
  events: WeddingEvent[];
};

const SuccessCheckmark = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
  >
    <motion.svg
      viewBox="0 0 52 52"
      className="h-12 w-12 text-primary"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
    >
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        d="M14 27l8 8 16-16"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      />
    </motion.svg>
  </motion.div>
);

export const RsvpForm = ({ events }: RsvpFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guestCount: 1,
      eventsAttending: [],
      dietaryRestrictions: "",
      message: "",
    },
  });

  const onSubmit = async (data: RsvpFormData) => {
    setServerError(null);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setServerError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setServerError("Unable to submit RSVP. Please check your connection.");
    }
  };

  return (
    <Section id="rsvp">
      <SectionHeading title="RSVP" subtitle="We would be honoured by your presence" />

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <SuccessCheckmark />
            <p className="mt-6 font-serif text-2xl text-primary">Thank You!</p>
            <p className="mt-2 text-muted">
              Your RSVP has been received. We look forward to celebrating with you.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-lg space-y-5"
            noValidate
          >
            <div>
              <label htmlFor="guestName" className="mb-1 block text-sm font-medium">
                Full Name
              </label>
              <input
                id="guestName"
                {...register("guestName")}
                className="w-full rounded-lg border border-accent/30 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Your full name"
              />
              {errors.guestName && (
                <p className="mt-1 text-xs text-red-600">{errors.guestName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact" className="mb-1 block text-sm font-medium">
                Phone or Email
              </label>
              <input
                id="contact"
                {...register("contact")}
                className="w-full rounded-lg border border-accent/30 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Phone number or email"
              />
              {errors.contact && (
                <p className="mt-1 text-xs text-red-600">{errors.contact.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="guestCount" className="mb-1 block text-sm font-medium">
                Number of Guests
              </label>
              <input
                id="guestCount"
                type="number"
                min={1}
                max={20}
                {...register("guestCount", { valueAsNumber: true })}
                className="w-full rounded-lg border border-accent/30 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.guestCount && (
                <p className="mt-1 text-xs text-red-600">{errors.guestCount.message}</p>
              )}
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Events Attending</legend>
              <div className="space-y-2">
                {events.map((event) => (
                  <label
                    key={event.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-accent/20 px-4 py-3 transition-colors hover:bg-primary/5"
                  >
                    <input
                      type="checkbox"
                      value={event.id}
                      {...register("eventsAttending")}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm">{event.name}</span>
                  </label>
                ))}
              </div>
              {errors.eventsAttending && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.eventsAttending.message}
                </p>
              )}
            </fieldset>

            <div>
              <label htmlFor="dietaryRestrictions" className="mb-1 block text-sm font-medium">
                Dietary Restrictions <span className="text-muted">(optional)</span>
              </label>
              <input
                id="dietaryRestrictions"
                {...register("dietaryRestrictions")}
                className="w-full rounded-lg border border-accent/30 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Vegetarian, allergies, etc."
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium">
                Message to the Couple <span className="text-muted">(optional)</span>
              </label>
              <textarea
                id="message"
                rows={3}
                {...register("message")}
                className="w-full resize-none rounded-lg border border-accent/30 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Share your wishes..."
              />
            </div>

            {serverError && (
              <p className="text-center text-sm text-red-600">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary px-8 py-3 text-sm uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit RSVP"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </Section>
  );
};
