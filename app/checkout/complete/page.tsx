import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "주문 접수 완료 — VEIL" };

type Props = { searchParams: Promise<{ order?: string }> };

export default async function CompletePage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap narrow empty">
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
