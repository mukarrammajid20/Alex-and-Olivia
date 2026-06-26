import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { getWeddingData, updateWeddingData } from "@/lib/storage/wedding-store";

export const POST = async (request: Request) => {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const alt = (formData.get("alt") as string) || "Wedding photo";
  const replaceIndex = formData.get("replaceIndex");

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP images are allowed" },
      { status: 400 }
    );
  }

  const galleryDir = path.join(process.cwd(), "public", "gallery");
  await fs.mkdir(galleryDir, { recursive: true });

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `upload-${Date.now()}.${ext}`;
  const filepath = path.join(galleryDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  const src = `/gallery/${filename}`;
  const data = await getWeddingData();
  const images = [...data.gallery.images];

  if (replaceIndex !== null && replaceIndex !== undefined) {
    const index = Number(replaceIndex);
    if (!Number.isNaN(index) && index >= 0 && index < images.length) {
      images[index] = { src, alt };
    } else {
      images.push({ src, alt });
    }
  } else {
    images.push({ src, alt });
  }

  const updated = await updateWeddingData({
    ...data,
    gallery: { images },
  });

  return NextResponse.json(updated.gallery);
};

export const DELETE = async (request: Request) => {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { index } = (await request.json()) as { index?: number };
  if (index === undefined || index < 0) {
    return NextResponse.json({ error: "Invalid index" }, { status: 400 });
  }

  const data = await getWeddingData();
  const images = data.gallery.images.filter((_, i) => i !== index);

  const updated = await updateWeddingData({
    ...data,
    gallery: { images },
  });

  return NextResponse.json(updated.gallery);
};
