export type EcommerceItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

export type EcommercePayload = {
  currency: "KRW";
  value: number;
  items: EcommerceItem[];
  transaction_id?: string;
};

type DataLayerEvent = {
  event?: string;
  ecommerce: EcommercePayload | null;
};

const PENDING_PURCHASE_KEY = "veil_pending_purchase";

export function ecommerceItem(
  product: { slug: string; name: string; volume: string | null; price: number },
  quantity: number,
): EcommerceItem {
  return {
    item_id: product.slug,
    item_name: product.name,
    ...(product.volume ? { item_variant: product.volume } : {}),
    price: product.price,
    quantity,
  };
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function pushEcommerce(event: string, ecommerce: EcommercePayload) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce });
}

export type PendingPurchase = {
  transaction_id: string;
  value: number;
  items: EcommerceItem[];
};

function isEcommerceItem(value: unknown): value is EcommerceItem {
  if (!value || typeof value !== "object") return false;
  const item = value as EcommerceItem;
  return (
    typeof item.item_id === "string" &&
    typeof item.item_name === "string" &&
    typeof item.price === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    (item.item_variant === undefined || typeof item.item_variant === "string")
  );
}

export function savePendingPurchase(purchase: PendingPurchase) {
  sessionStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(purchase));
}

export function readPendingPurchase(): PendingPurchase | null {
  const raw = sessionStorage.getItem(PENDING_PURCHASE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PendingPurchase;
    if (typeof parsed?.transaction_id !== "string" || !Array.isArray(parsed.items)) return null;
    if (!parsed.items.every(isEcommerceItem)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingPurchase() {
  sessionStorage.removeItem(PENDING_PURCHASE_KEY);
}

export function purchaseAlreadySent(transactionId: string) {
  return sessionStorage.getItem(`veil_purchase_sent_${transactionId}`) === "1";
}

export function markPurchaseSent(transactionId: string) {
  sessionStorage.setItem(`veil_purchase_sent_${transactionId}`, "1");
}
