import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";

export const POST = async () => {
  const session = await getAdminSession();
  session.destroy();
  return NextResponse.json({ success: true });
};
