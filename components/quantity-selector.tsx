"use client";

import { MAX_QUANTITY } from "@/lib/shop";

type Props = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
};

export function QuantitySelector({ value, onChange, disabled, label = "수량" }: Props) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="수량 줄이기"
      >
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= MAX_QUANTITY}
        aria-label="수량 늘리기"
      >
        +
      </button>
    </div>
  );
}
