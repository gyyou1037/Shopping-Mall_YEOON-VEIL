import "server-only";
import { createClient } from "@/lib/supabase/server";

// Order state changes are protected by a server-only secret that the DB functions verify.
// The browser never sees ORDER_ADMIN_SECRET, so it cannot mark an order as paid.
function secret() {
  const value = process.env.ORDER_ADMIN_SECRET;
  if (!value) throw new Error("ORDER_ADMIN_SECRET is not set");
  return value;
}

export type PaymentOrder = {
  order_number: string;
  status: string;
  total_price: number;
  from_cart: boolean;
};

export async function getOrderForPayment(orderNumber: string): Promise<PaymentOrder | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_order_for_payment", {
    p_secret: secret(),
    p_order_number: orderNumber,
  });
  if (error) throw error;
  return (data as PaymentOrder | null) ?? null;
}

export async function markOrderPaid(input: {
  orderNumber: string;
  paymentKey: string;
  method: string;
  approvedAt: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_order_paid", {
    p_secret: secret(),
    p_order_number: input.orderNumber,
    p_payment_key: input.paymentKey,
    p_method: input.method,
    p_approved_at: input.approvedAt,
  });
  if (error) throw error;
}

export async function markOrderFailed(orderNumber: string, reason: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_order_failed", {
    p_secret: secret(),
    p_order_number: orderNumber,
    p_reason: reason,
  });
  if (error) throw error;
}
