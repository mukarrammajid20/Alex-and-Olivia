"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RsvpSubmission } from "@/lib/types/wedding";

type SortKey = "guestName" | "guestCount" | "submittedAt";

export const RsvpTable = () => {
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [totalGuests, setTotalGuests] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("submittedAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRsvps = useCallback(async () => {
    const res = await fetch("/api/admin/rsvps");
    if (res.ok) {
      const data = (await res.json()) as {
        rsvps: RsvpSubmission[];
        totalGuests: number;
      };
      setRsvps(data.rsvps);
      setTotalGuests(data.totalGuests);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchRsvps();
  }, [fetchRsvps]);

  const filtered = useMemo(() => {
    const query = filter.toLowerCase();
    const result = rsvps.filter(
      (r) =>
        r.guestName.toLowerCase().includes(query) ||
        r.contact.toLowerCase().includes(query) ||
        r.eventsAttending.some((e) => e.toLowerCase().includes(query))
    );

    return result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [rsvps, filter, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted">Loading RSVPs...</p>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-primary">{rsvps.length}</span> RSVPs ·{" "}
          <span className="font-semibold text-primary">{totalGuests}</span> total guests
        </p>
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, contact, or event..."
          className="rounded-lg border border-accent/30 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-accent/20">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary/5 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("guestName")}>
                Name {sortKey === "guestName" && (sortAsc ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3">Contact</th>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("guestCount")}>
                Guests {sortKey === "guestCount" && (sortAsc ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3">Events</th>
              <th className="px-4 py-3">Dietary</th>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("submittedAt")}>
                Submitted {sortKey === "submittedAt" && (sortAsc ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/10">
            {filtered.map((rsvp) => (
              <tr key={rsvp.id} className="hover:bg-primary/5">
                <td className="px-4 py-3 font-medium">{rsvp.guestName}</td>
                <td className="px-4 py-3 text-muted">{rsvp.contact}</td>
                <td className="px-4 py-3">{rsvp.guestCount}</td>
                <td className="px-4 py-3 text-muted">{rsvp.eventsAttending.join(", ")}</td>
                <td className="px-4 py-3 text-muted">{rsvp.dietaryRestrictions || "—"}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(rsvp.submittedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No RSVPs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
