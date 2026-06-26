import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  isAdmin: boolean;
};

const getSessionPassword = (): string => {
  const password = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!password || password.length < 32) {
    return "development-only-session-secret-min-32-chars!!";
  }
  return password;
};

export const sessionOptions: SessionOptions = {
  password: getSessionPassword(),
  cookieName: "wedding_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  },
};

export const getAdminSession = async () => {
  const session = await getIronSession<AdminSession>(cookies(), sessionOptions);
  return session;
};
