"use server";

import { revalidatePath } from "next/cache";
import { readCart, writeCart } from "@/lib/cart";
import { getProductsByIds } from "@/lib/products";
import { MAX_QUANTITY, clampQuantity } from "@/lib/shop";

export type CartResult =
  | { ok: true; quantity: number; added: number; capped: boolean }
  | { ok: false; message: string };

export async function addToCart(productId: string, quantity: number): Promise<CartResult> {
  const [product] = await getProductsByIds([String(productId)]);
  if (!product) return { ok: false, message: "상품을 찾을 수 없습니다." };

  const lines = await readCart();
  const existing = lines.find((line) => line.productId === product.id);
  const previous = existing?.quantity ?? 0;
  const requested = previous + clampQuantity(Number(quantity));
  const next = Math.min(MAX_QUANTITY, requested);

  const updated = existing
    ? lines.map((line) => (line.productId === product.id ? { ...line, quantity: next } : line))
    : [...lines, { productId: product.id, quantity: next }];
  await writeCart(updated);
  revalidatePath("/cart");

  return { ok: true, quantity: next, added: next - previous, capped: requested > MAX_QUANTITY };
}

export async function updateCartItem(productId: string, quantity: number): Promise<void> {
  const lines = await readCart();
  await writeCart(
    lines.map((line) =>
      line.productId === productId ? { ...line, quantity: clampQuantity(Number(quantity)) } : line,
    ),
  );
  revalidatePath("/cart");
}

export async function removeCartItem(productId: string): Promise<void> {
  const lines = await readCart();
  await writeCart(lines.filter((line) => line.productId !== productId));
  revalidatePath("/cart");
}
