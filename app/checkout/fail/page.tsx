import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "결제 실패 — VEIL" };

type Props = { searchParams: Promise<{ code?: string; message?: string; orderId?: string }> };

export default async function FailPage({ searchParams }: Props) {
  const { code, message } = await searchParams;
  const canceled = code === "PAY_PROCESS_CANCELED" || code === "USER_CANCEL";

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap narrow empty">
        <h1 className="page-title">{canceled ? "결제를 취소했어요." : "결제에 실패했어요."}</h1>
        {!canceled && message ? <p className="muted">{message}</p> : null}
        {!canceled && code ? <p className="fine">오류 코드: {code}</p> : null}
        <Link className="button dark" href="/cart">
          장바구니로 돌아가기
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
