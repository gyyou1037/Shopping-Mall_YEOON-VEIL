import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackPurchase } from "@/components/track-ecommerce";
import { getOrderForPayment } from "@/lib/order-admin";

export const metadata: Metadata = { title: "주문 접수 완료 — VEIL" };

type Props = { searchParams: Promise<{ order?: string }> };

export default async function CompletePage({ searchParams }: Props) {
  const { order } = await searchParams;
  const purchase = await paidPurchase(order);

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap narrow empty">
        {purchase ? <TrackPurchase transactionId={purchase.transactionId} value={purchase.value} /> : null}
        <p className="eyebrow">THANK YOU</p>
        <h1 className="page-title">결제가 완료되었습니다.</h1>
        {order ? (
          <p>
            주문번호 <strong>{order}</strong>
          </p>
        ) : null}
        <p className="muted">
          테스트 결제가 정상적으로 승인되었습니다.
          <br />
          배송 안내는 남겨 주신 연락처로 전달드릴 예정입니다.
        </p>
        <Link className="button dark" href="/">
          홈으로 돌아가기
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}

async function paidPurchase(order: string | undefined) {
  if (!order) return null;
  try {
    const paid = await getOrderForPayment(order);
    if (paid?.status !== "paid" || paid.total_price <= 0) return null;
    return { transactionId: paid.order_number, value: paid.total_price };
  } catch (error) {
    console.error("Failed to read paid order for analytics", error);
    return null;
  }
}
