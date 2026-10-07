import { cookies } from "next/headers";
import { clampQuantity } from "@/lib/shop";

export type CartLine = { productId: string; quantity: number };

const COOKIE_NAME = "veil_cart";
const MAX_AGE = 60 * 60 * 24 * 30;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parse(raw: string | undefined): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const merged = new Map<string, number>();
    for (const item of data) {
      if (!item || typeof item !== "object") continue;
      const { productId, quantity } = item as Record<string, unknown>;
      if (typeof productId !== "string" || !UUID.test(productId)) continue;
      if (typeof quantity !== "number") continue;
      merged.set(productId, clampQuantity((merged.get(productId) ?? 0) + quantity));
    }
    return [...merged].map(([productId, quantity]) => ({ productId, quantity }));
  } catch {
    return [];
  }
}

export async function readCart(): Promise<CartLine[]> {
  const store = await cookies();
  return parse(store.get(COOKIE_NAME)?.value);
}

// Cookies can only be written from Server Actions or Route Handlers.
export async function writeCart(lines: CartLine[]) {
  const store = await cookies();
  if (lines.length === 0) {
    store.delete(COOKIE_NAME);
    return;
  }
  store.set(COOKIE_NAME, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearCart() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
