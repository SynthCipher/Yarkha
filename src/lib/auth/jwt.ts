import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { UserRole } from "@/config/constants";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super_secret_jwt_key_ladakh_farm_2026_at_least_32_characters_long"
);

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  [key: string]: any;
}

const COOKIE_NAME = "yarkha_session";

export async function signToken(payload: TokenPayload, expiresIn = "7d"): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSessionUser(): Promise<TokenPayload | null> {
  try {
    const headerList = await headers();
    const authHeader = headerList.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const headerToken = authHeader.substring(7).trim();
      const verified = await verifyToken(headerToken);
      if (verified) return verified;
    }
  } catch {}

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      return await verifyToken(token);
    }
  } catch {}

  return null;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
