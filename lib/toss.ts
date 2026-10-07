import "server-only";

export type TossPayment = {
  paymentKey: string;
  orderId: string;
  status: string;
  method: string | null;
  totalAmount: number;
  approvedAt: string | null;
};

export type ConfirmResult =
  | { ok: true; payment: TossPayment }
  | { ok: false; code: string; message: string };

// https://docs.tosspayments.com/reference#결제-승인
export async function confirmTossPayment(input: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<ConfirmResult> {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) throw new Error("TOSS_SECRET_KEY is not set");

  // Basic base64("{secretKey}:") - the trailing colon is required.
  const auth = Buffer.from(`${secretKey}:`).toString("base64");

  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.paymentKey,
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const body = (await response.json().catch(() => ({}))) as Partial<TossPayment> & {
    code?: string;
    message?: string;
  };

  if (!response.ok) {
    return { ok: false, code: body.code ?? "UNKNOWN", message: body.message ?? "결제 승인에 실패했습니다." };
  }
  return { ok: true, payment: body as TossPayment };
}
