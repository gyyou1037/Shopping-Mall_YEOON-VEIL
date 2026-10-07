"use server";

import { redirect } from "next/navigation";
import { clearCart } from "@/lib/cart";
import { getOrderForPayment, markOrderFailed, markOrderPaid } from "@/lib/order-admin";
import { confirmTossPayment } from "@/lib/toss";

export type ConfirmResult = { ok: false; message: string };

const ORDER_ID = /^[A-Za-z0-9_=-]{6,64}$/;

function complete(orderNumber: string): never {
  redirect(`/checkout/complete?order=${encodeURIComponent(orderNumber)}`);
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<ConfirmResult> {
  if (!paymentKey || paymentKey.length > 200 || !ORDER_ID.test(orderId) || !Number.isInteger(amount)) {
    return { ok: false, message: "결제 정보가 올바르지 않습니다." };
  }

  const order = await getOrderForPayment(orderId);
  if (!order) return { ok: false, message: "주문을 찾을 수 없습니다." };

  // Reloading the success page must not confirm twice.
  if (order.status === "paid") complete(order.order_number);

  if (order.status !== "pending_payment" && order.status !== "payment_failed") {
    return { ok: false, message: "결제할 수 없는 주문입니다." };
  }

  // The amount in the redirect query can be tampered with; compare with the DB total.
  if (order.total_price !== amount) {
    await markOrderFailed(order.order_number, "amount mismatch");
    return { ok: false, message: "결제 금액이 주문 금액과 달라 결제를 진행하지 않았습니다." };
  }

  const result = await confirmTossPayment({ paymentKey, orderId, amount });

  if (!result.ok) {
    // A concurrent call may have already finished this payment.
    const latest = await getOrderForPayment(orderId);
    if (latest?.status === "paid") complete(order.order_number);
    await markOrderFailed(order.order_number, `${result.code}: ${result.message}`);
    return { ok: false, message: result.message };
  }

  const { payment } = result;
  if (payment.status !== "DONE" || payment.orderId !== orderId || payment.totalAmount !== order.total_price) {
    await markOrderFailed(order.order_number, `unexpected payment: ${payment.status}`);
    return { ok: false, message: "결제 결과를 확인하지 못했습니다. 고객센터로 문의해 주세요." };
  }

  await markOrderPaid({
    orderNumber: order.order_number,
    paymentKey: payment.paymentKey,
    method: payment.method ?? "",
    approvedAt: payment.approvedAt ?? new Date().toISOString(),
  });
  if (order.from_cart) await clearCart();

  complete(order.order_number);
}
