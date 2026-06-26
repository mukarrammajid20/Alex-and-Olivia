"use client";

import { useState } from "react";
import type { WeddingEvent } from "@/lib/types/wedding";

type EventEditorProps = {
  events: WeddingEvent[];
  onSave: (events: WeddingEvent[]) => Promise<void>;
};

export const EventEditor = ({ events, onSave }: EventEditorProps) => {
  const [formEvents, setFormEvents] = useState(events);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const updateEvent = (index: number, updates: Partial<WeddingEvent>) => {
    setFormEvents((prev) =>
      prev.map((event, i) => (i === index ? { ...event, ...updates } : event))
    );
  };

  const updateVenue = (
    index: number,
    updates: Partial<WeddingEvent["venue"]>
  ) => {
    setFormEvents((prev) =>
      prev.map((event, i) =>
        i === index ? { ...event, venue: { ...event.venue, ...updates } } : event
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await onSave(formEvents);
      setMessage("Events saved — maps and schedule updated live!");
    } catch {
      setMessage("Failed to save events.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {formEvents.map((event, index) => (
        <div
          key={event.id}
          className="rounded-xl border border-accent/20 p-5"
        >
          <h3 className="font-serif text-lg text-primary">{event.name}</h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted">Event Name</label>
              <input
                value={event.name}
                onChange={(e) => updateEvent(index, { name: e.target.value })}
                className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Date</label>
              <input
                type="date"
                value={event.date}
                onChange={(e) => updateEvent(index, { date: e.target.value })}
                className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Time</label>
              <input
                type="time"
                value={event.time}
                onChange={(e) => updateEvent(index, { time: e.target.value })}
                className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Venue Name</label>
              <input
                value={event.venue.name}
                onChange={(e) => updateVenue(index, { name: e.target.value })}
                className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted">Address</label>
              <input
                value={event.venue.address}
                onChange={(e) => updateVenue(index, { address: e.target.value })}
                className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Latitude</label>
              <input
                type="number"
                step="any"
                value={event.venue.lat}
                onChange={(e) =>
                  updateVenue(index, { lat: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Longitude</label>
              <input
                type="number"
                step="any"
                value={event.venue.lng}
                onChange={(e) =>
                  updateVenue(index, { lng: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      {message && (
        <p className={`text-sm ${message.includes("live") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="rounded-full bg-primary px-6 py-2 text-sm text-background disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Events"}
      </button>
    </div>
  );
};
