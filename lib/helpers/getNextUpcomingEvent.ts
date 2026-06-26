import type { WeddingEvent } from "@/lib/types/wedding";

const parseEventDateTime = (event: WeddingEvent): Date => {
  const [hours, minutes] = event.time.split(":").map(Number);
  const date = new Date(`${event.date}T00:00:00`);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const getNextUpcomingEvent = (
  events: WeddingEvent[],
  now: Date = new Date()
): WeddingEvent | null => {
  const upcoming = events
    .map((event) => ({ event, dateTime: parseEventDateTime(event) }))
    .filter(({ dateTime }) => dateTime.getTime() > now.getTime())
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  return upcoming[0]?.event ?? null;
};

export const getEventDateTime = (event: WeddingEvent): Date =>
  parseEventDateTime(event);
