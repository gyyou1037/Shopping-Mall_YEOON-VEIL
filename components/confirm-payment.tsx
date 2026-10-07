"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { confirmPayment } from "@/app/actions/payment";

type Props = { paymentKey: string; orderId: string; amount: number };

export function ConfirmPayment({ paymentKey, orderId, amount }: Props) {
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Strict Mode runs effects twice in development; confirm only once.
    if (started.current) return;
    started.current = true;

    confirmPayment(paymentKey, orderId, amount)
      .then((result) => {
        // On success the action redirects, so a returned value is always an error.
        if (result && !result.ok) setError(result.message);
      })
      .catch(() => setError("결제 승인 중 문제가 발생했습니다. 잠시 후 다시 확인해 주세요."));
  }, [paymentKey, orderId, amount]);

  if (error) {
    return (
      <>
        <h1 className="page-title">결제를 완료하지 못했습니다.</h1>
        <p className="form-status error" role="status">
          {error}
        </p>
        <Link className="button dark" href="/cart">
          장바구니로 돌아가기
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">결제를 확인하고 있습니다.</h1>
      <p className="muted" role="status">
        잠시만 기다려 주세요. 창을 닫거나 새로고침하지 마세요.
      </p>
    </>
  );
}
