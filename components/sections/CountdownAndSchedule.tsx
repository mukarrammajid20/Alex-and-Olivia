"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/design-system/Section";
import { SectionHeading } from "@/components/design-system/SectionHeading";
import { EventMap } from "@/components/maps/EventMap";
import { GetDirectionsButton } from "@/components/maps/GetDirectionsButton";
import { formatEventDateTime } from "@/lib/helpers/formatWeddingDate";
import { getNextUpcomingEvent } from "@/lib/helpers/getNextUpcomingEvent";
import type { WeddingEvent } from "@/lib/types/wedding";

type CountdownTimerProps = {
  events: WeddingEvent[];
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const TimeUnit = ({ value, label, index }: { value: number; label: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
    className="flex min-w-[4.5rem] flex-col items-center rounded-lg border border-accent/30 bg-background/80 px-3 py-4 shadow-sm backdrop-blur-sm"
  >
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="font-serif text-3xl text-primary sm:text-4xl"
    >
      {String(value).padStart(2, "0")}
    </motion.span>
    <span className="mt-1 text-[0.65rem] uppercase tracking-widest text-muted">
      {label}
    </span>
  </motion.div>
);

export const CountdownTimer = ({ events }: CountdownTimerProps) => {
  const [targetEvent, setTargetEvent] = useState<WeddingEvent | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const next = getNextUpcomingEvent(events);
      setTargetEvent(next);
      if (next) {
        const [hours, minutes] = next.time.split(":").map(Number);
        const target = new Date(`${next.date}T00:00:00`);
        target.setHours(hours, minutes, 0, 0);
        setTimeLeft(calculateTimeLeft(target));
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [events]);

  if (!targetEvent) {
    return (
      <Section className="bg-primary/5">
        <SectionHeading title="The Celebration Has Begun" subtitle="All events have passed — thank you for being part of our journey" />
      </Section>
    );
  }

  return (
    <Section className="bg-primary/5">
      <SectionHeading
        title="Counting Down"
        subtitle={`To ${targetEvent.name}`}
      />
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <TimeUnit value={timeLeft.days} label="Days" index={0} />
        <TimeUnit value={timeLeft.hours} label="Hours" index={1} />
        <TimeUnit value={timeLeft.minutes} label="Minutes" index={2} />
        <TimeUnit value={timeLeft.seconds} label="Seconds" index={3} />
      </div>
    </Section>
  );
};

type EventScheduleProps = {
  events: WeddingEvent[];
  mapsApiKey?: string;
};

export const EventSchedule = ({ events, mapsApiKey }: EventScheduleProps) => (
  <Section id="events">
    <SectionHeading title="Event Schedule" subtitle="Join us for each celebration" />
    <div className="space-y-8">
      {events.map((event, index) => (
        <motion.article
          key={event.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 24 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="overflow-hidden rounded-2xl border border-accent/20 bg-background shadow-sm"
        >
          <div className="p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-primary sm:text-3xl">
              {event.name}
            </h3>
            <p className="mt-2 text-sm text-muted sm:text-base">
              {formatEventDateTime(event.date, event.time)}
            </p>
            <div className="mt-4">
              <p className="font-medium text-foreground">{event.venue.name}</p>
              <p className="mt-1 text-sm text-muted">{event.venue.address}</p>
            </div>
            <div className="mt-4">
              <GetDirectionsButton venue={event.venue} />
            </div>
          </div>
          <EventMap venue={event.venue} apiKey={mapsApiKey} />
        </motion.article>
      ))}
    </div>
  </Section>
);
