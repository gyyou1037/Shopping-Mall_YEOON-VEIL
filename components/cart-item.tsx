"use client";

import { useState, useTransition } from "react";
import { removeCartItem, updateCartItem } from "@/app/actions/cart";
import { Photo } from "@/components/photo";
import { QuantitySelector } from "@/components/quantity-selector";
import { formatPrice } from "@/lib/shop";

type Props = {
  productId: string;
  name: string;
  volume: string | null;
  image: string;
  price: number;
  quantity: number;
};

export function CartItem({ productId, name, volume, image, price, quantity }: Props) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<number | null>(null);
  const shown = pending && optimistic !== null ? optimistic : quantity;

  function change(next: number) {
    setOptimistic(next);
    startTransition(async () => {
      await updateCartItem(productId, next);
    });
  }

  function remove() {
    startTransition(async () => {
      await removeCartItem(productId);
    });
  }

  return (
    <li className="cart-item" aria-busy={pending}>
      <Photo src={image} width={160} height={160} alt={`${name} 제품 이미지`} />
      <div className="cart-item-info">
        <strong>{name}</strong>
        {volume ? <span className="muted">{volume}</span> : null}
        <span>{formatPrice(price)}</span>
      </div>
      <QuantitySelector value={shown} onChange={change} disabled={pending} label={`${name} 수량`} />
      <strong className="cart-item-total">{formatPrice(price * shown)}</strong>
      <button className="cart-remove" type="button" onClick={remove} disabled={pending} aria-label={`${name} 삭제`}>
        삭제
      </button>
    </li>
  );
}
