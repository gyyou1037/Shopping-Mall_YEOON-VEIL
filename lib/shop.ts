export const MAX_QUANTITY = 5;

export function clampQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(value)));
}

export function formatPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`;
}
