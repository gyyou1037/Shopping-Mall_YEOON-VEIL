import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "veil_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

function signingKey() {
  const secret = process.env.ORDER_ADMIN_SECRET;
  if (!secret) throw new Error("ORDER_ADMIN_SECRET is not set");
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}

export async function createAdminSession() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${expires}`;
  const store = await cookies();
  store.set(COOKIE_NAME, `${payload}.${sign(payload)}`, cookieOptions());
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const role = token.slice(0, token.indexOf("."));
  const rest = token.slice(role.length + 1);
  const split = rest.lastIndexOf(".");
  if (role !== "admin" || split < 0) return false;
  const expires = rest.slice(0, split);
  const mac = rest.slice(split + 1);
  const payload = `${role}.${expires}`;
  const expected = sign(payload);
  const actual = Buffer.from(mac);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !timingSafeEqual(actual, wanted)) return false;
  return Number(expires) > Date.now();
}
