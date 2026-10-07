"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addToCart } from "@/app/actions/cart";
import { QuantitySelector } from "@/components/quantity-selector";
import { MAX_QUANTITY, formatPrice } from "@/lib/shop";

type Props = { productId: string; slug: string; price: number };

export function ProductPurchase({ productId, slug, price }: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ text: string; error: boolean; added: boolean } | null>(null);

  function onAddToCart() {
    setNotice(null);
    startTransition(async () => {
      const result = await addToCart(productId, quantity);
      if (!result.ok) {
        setNotice({ text: result.message, error: true, added: false });
        return;
      }
      setNotice({
        text: result.capped
          ? `한 상품은 최대 ${MAX_QUANTITY}개까지 담을 수 있어요. 장바구니에 ${result.quantity}개가 담겨 있습니다.`
          : `장바구니에 담았습니다. (현재 ${result.quantity}개)`,
        error: false,
        added: true,
      });
    });
  }

  function onBuyNow() {
    router.push(`/checkout?product=${encodeURIComponent(slug)}&qty=${quantity}`);
  }

  return (
    <div className="purchase">
      <div className="purchase-row">
        <span id="qty-label">수량</span>
        <QuantitySelector value={quantity} onChange={setQuantity} disabled={pending} />
        <span className="purchase-hint">최대 {MAX_QUANTITY}개</span>
      </div>
      <div className="purchase-total">
        <span>총 상품금액</span>
        <strong>{formatPrice(price * quantity)}</strong>
      </div>
      <div className="purchase-actions">
        <button className="button" type="button" onClick={onAddToCart} disabled={pending}>
          {pending ? "담는 중" : "장바구니 담기"}
        </button>
        <button className="button dark" type="button" onClick={onBuyNow} disabled={pending}>
          바로구매
        </button>
      </div>
      {notice ? (
        <p className={notice.error ? "form-status error" : "form-status"} role="status">
          {notice.text}{" "}
          {notice.added ? (
            <Link className="inline-link" href="/cart">
              장바구니로 이동
            </Link>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
