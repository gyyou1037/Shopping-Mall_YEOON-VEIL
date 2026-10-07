import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmPayment } from "@/components/confirm-payment";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "결제 확인 — VEIL" };

type Props = { searchParams: Promise<{ paymentKey?: string; orderId?: string; amount?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { paymentKey, orderId, amount } = await searchParams;
  const value = Number(amount);
  const valid = Boolean(paymentKey && orderId) && Number.isInteger(value);

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap narrow empty">
        {valid ? (
          <ConfirmPayment paymentKey={paymentKey!} orderId={orderId!} amount={value} />
        ) : (
          <>
            <h1 className="page-title">잘못된 접근입니다.</h1>
            <Link className="button dark" href="/cart">
              장바구니로 돌아가기
            </Link>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
