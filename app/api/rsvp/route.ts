import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/validations/rsvp";
import { getRsvpStore } from "@/lib/storage/rsvp-store";
import { checkRateLimit } from "@/lib/helpers/rateLimit";
import { getClientIp } from "@/lib/helpers/getClientIp";

const RSVP_COOKIE = "rsvp_submitted";

export const POST = async (request: Request) => {
  try {
    const ip = getClientIp();
    const rateLimit = checkRateLimit(`rsvp:${ip}`, {
      windowMs: 60 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body: unknown = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const existingCookie = cookieStore.get(RSVP_COOKIE)?.value;

    if (existingCookie === parsed.data.contact.toLowerCase()) {
      return NextResponse.json(
        { error: "You have already submitted an RSVP from this device." },
        { status: 409 }
      );
    }

    const store = await getRsvpStore();
    const existing = await store.findByContact(parsed.data.contact);

    if (existing) {
      return NextResponse.json(
        { error: "An RSVP with this contact info already exists." },
        { status: 409 }
      );
    }

    await store.create(parsed.data, ip);

    const response = NextResponse.json({ success: true });
    response.cookies.set(RSVP_COOKIE, parsed.data.contact.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to process RSVP. Please try again." },
      { status: 500 }
    );
  }
};
