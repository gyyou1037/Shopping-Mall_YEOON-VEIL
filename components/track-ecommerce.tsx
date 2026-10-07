"use client";

import { useEffect } from "react";
import {
  clearPendingPurchase,
  markPurchaseSent,
  purchaseAlreadySent,
  pushEcommerce,
  readPendingPurchase,
  type EcommerceItem,
} from "@/lib/analytics";

type Props = {
  event: "view_item" | "view_cart" | "begin_checkout";
  items: EcommerceItem[];
  value: number;
};

export function TrackEcommerce({ event, items, value }: Props) {
  const signature = JSON.stringify({ event, value, items });
  // view_cart is a page arrival. Quantity edits re-render this component, so keep the first payload.
  const arrival = event === "view_cart";

  useEffect(() => {
    const payload = JSON.parse(signature) as Props;
    const timer = window.setTimeout(() => {
      pushEcommerce(payload.event, {
        currency: "KRW",
        value: payload.value,
        items: payload.items,
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [arrival ? "view_cart" : signature]);

  return null;
}

export function TrackPurchase({ transactionId, value }: { transactionId: string; value: number }) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (purchaseAlreadySent(transactionId)) return;
      const pending = readPendingPurchase();
      const items = pending?.transaction_id === transactionId ? pending.items : [];
      pushEcommerce("purchase", {
        currency: "KRW",
        value,
        transaction_id: transactionId,
        items,
      });
      markPurchaseSent(transactionId);
      if (pending?.transaction_id === transactionId) clearPendingPurchase();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [transactionId, value]);

  return null;
}
