"use server";

import { readCart, type CartLine } from "@/lib/cart";
import { clampQuantity } from "@/lib/shop";
import { createClient } from "@/lib/supabase/server";

export type OrderResult =
  | {
      ok: true;
      orderId: string;
      amount: number;
      orderName: string;
      customerName: string;
      customerMobilePhone: string;
    }
  | { ok: false; message: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formatPhone(digits: string) {
  return digits.length === 11
    ? `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
    : `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export async function placeOrder(formData: FormData): Promise<OrderResult> {
  const name = text(formData, "name");
  const phoneDigits = text(formData, "phone").replace(/\D/g, "");
  const zipcode = text(formData, "zipcode");
  const address = text(formData, "address");
  const addressDetail = text(formData, "address_detail");
  const deliveryNote = text(formData, "delivery_note");

  if (!name || name.length > 40) {
    return { ok: false, message: "이름을 40자 이내로 입력해 주세요." };
  }
  if (!/^01[016789]\d{7,8}$/.test(phoneDigits)) {
    return { ok: false, message: "올바른 휴대전화 번호를 입력해 주세요." };
  }
  if (!zipcode || !address || address.length > 300) {
    return { ok: false, message: "주소 검색으로 배송지를 입력해 주세요." };
  }
  if (addressDetail.length > 200 || deliveryNote.length > 200) {
    return { ok: false, message: "상세주소와 배송 요청사항은 200자 이내로 입력해 주세요." };
  }

  // Items come from the server-side cookie, or from the direct-purchase fields.
  const direct = text(formData, "mode") === "direct";
  let lines: CartLine[];
  if (direct) {
    const productId = text(formData, "productId");
    if (!UUID.test(productId)) {
      return { ok: false, message: "주문할 상품을 찾을 수 없습니다." };
    }
    lines = [{ productId, quantity: clampQuantity(Number(text(formData, "quantity"))) }];
  } else {
    lines = await readCart();
  }
  if (lines.length === 0) {
    return { ok: false, message: "주문할 상품이 없습니다." };
  }

  // Prices and totals are recalculated inside the create_order DB function.
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_order", {
    customer: {
      name,
      phone: formatPhone(phoneDigits),
      zipcode,
      address,
      address_detail: addressDetail,
      delivery_note: deliveryNote,
    },
    items: lines.map((line) => ({ product_id: line.productId, quantity: line.quantity })),
    p_from_cart: !direct,
  });

  const created = data as { order_number?: string; total_price?: number; order_name?: string } | null;
  if (error || !created?.order_number || typeof created.total_price !== "number") {
    console.error("Failed to create order", error);
    return { ok: false, message: "주문을 접수하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  // The cart is cleared after the payment is confirmed (see confirmPayment).
  return {
    ok: true,
    orderId: created.order_number,
    amount: created.total_price,
    orderName: created.order_name ?? "VEIL 주문",
    customerName: name,
    customerMobilePhone: phoneDigits,
  };
}
