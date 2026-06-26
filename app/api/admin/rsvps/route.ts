import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { getRsvpStore } from "@/lib/storage/rsvp-store";

export const GET = async () => {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rsvps = await getRsvpStore().getAll();
  const totalGuests = rsvps.reduce((sum, r) => sum + r.guestCount, 0);

  return NextResponse.json({ rsvps, totalGuests });
};
