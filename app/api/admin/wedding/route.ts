import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/session";
import { getWeddingData, updateWeddingData } from "@/lib/storage/wedding-store";
import type { WeddingConfig } from "@/lib/types/wedding";

const weddingUpdateSchema = z.object({
  couple: z
    .object({
      partner1: z.string().min(1),
      partner2: z.string().min(1),
    })
    .optional(),
  weddingDate: z.string().optional(),
  tagline: z.string().optional(),
  story: z
    .object({
      enabled: z.boolean(),
      title: z.string(),
      content: z.string(),
    })
    .optional(),
  events: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        date: z.string(),
        time: z.string(),
        venue: z.object({
          name: z.string(),
          address: z.string(),
          lat: z.number(),
          lng: z.number(),
        }),
      })
    )
    .optional(),
  theme: z
    .object({
      primary: z.string(),
      accent: z.string(),
      background: z.string(),
      foreground: z.string(),
      muted: z.string(),
    })
    .optional(),
  hero: z
    .object({
      backgroundImage: z.string(),
      ctaText: z.string(),
      theme: z
        .object({
          primary: z.string(),
          accent: z.string(),
          background: z.string(),
          foreground: z.string(),
          muted: z.string(),
        })
        .optional(),
    })
    .optional(),
  gallery: z
    .object({
      images: z.array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      ),
    })
    .optional(),
  seo: z
    .object({
      title: z.string(),
      description: z.string(),
      ogImage: z.string(),
    })
    .optional(),
  brand: z
    .object({
      name: z.string(),
    })
    .optional(),
});

export const GET = async () => {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getWeddingData();
  return NextResponse.json(data);
};

export const PUT = async (request: Request) => {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = weddingUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const current = await getWeddingData();
  const updated: WeddingConfig = {
    ...current,
    ...parsed.data,
    couple: parsed.data.couple ?? current.couple,
    story: parsed.data.story ?? current.story,
    events: parsed.data.events ?? current.events,
    theme: parsed.data.theme ?? current.theme,
    hero: parsed.data.hero
      ? {
          ...current.hero,
          ...parsed.data.hero,
          theme: { ...current.hero.theme, ...parsed.data.hero.theme },
        }
      : current.hero,
    gallery: parsed.data.gallery ?? current.gallery,
    seo: parsed.data.seo ?? current.seo,
    brand: parsed.data.brand ?? current.brand,
  };

  await updateWeddingData(updated);
  return NextResponse.json(updated);
};
