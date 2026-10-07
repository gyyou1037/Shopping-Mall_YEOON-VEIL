"use client";

import type { TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { useState } from "react";
import { placeOrder } from "@/app/actions/order";
import { AddressSearch } from "@/components/address-search";
import { TossPaymentWidget } from "@/components/toss-payment-widget";

type Props = {
  mode: "cart" | "direct";
  productId?: string;
  quantity?: number;
  amount: number;
};

const NOTE_PRESETS = ["문 앞에 놓아 주세요.", "경비실에 맡겨 주세요.", "배송 전 연락 부탁드립니다."];

export function CheckoutForm({ mode, productId, quantity, amount }: Props) {
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!widgets) {
      setError("결제 화면을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    const data = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      // 1) Create the order (the server recalculates the amount from DB prices).
      const result = await placeOrder(data);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      // 2) Open the payment window. On success TossPayments redirects to successUrl,
      //    where the server confirms the payment.
      await widgets.requestPayment({
        orderId: result.orderId,
        orderName: result.orderName,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerName: result.customerName,
        customerMobilePhone: result.customerMobilePhone,
      });
    } catch (e) {
      const code = (e as { code?: string } | null)?.code;
      setError(
        code === "USER_CANCEL" || code === "PAY_PROCESS_CANCELED"
          ? "결제를 취소했습니다. 다시 시도하려면 결제하기를 눌러 주세요."
          : "결제를 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="inquiry-form checkout-form" onSubmit={onSubmit}>
      <input type="hidden" name="mode" value={mode} />
      {productId ? <input type="hidden" name="productId" value={productId} /> : null}
      {quantity ? <input type="hidden" name="quantity" value={quantity} /> : null}

      <label>
        이름
        <input name="name" type="text" required maxLength={40} autoComplete="name" />
      </label>
      <label>
        전화번호
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          required
          maxLength={13}
          placeholder="010-1234-5678"
          autoComplete="tel"
        />
      </label>

      <div className="address-group">
        <span className="field-label">주소</span>
        <div className="address-row">
          <input
            name="zipcode"
            type="text"
            value={zipcode}
            readOnly
            required
            placeholder="우편번호"
            aria-label="우편번호"
          />
          <AddressSearch
            onSelect={(result) => {
              setZipcode(result.zipcode);
              setAddress(result.address);
              requestAnimationFrame(() => document.getElementById("address-detail")?.focus());
            }}
          />
        </div>
        <input
          name="address"
          type="text"
          value={address}
          readOnly
          required
          placeholder="주소 검색 버튼을 눌러 주세요"
          aria-label="기본 주소"
        />
        <input
          id="address-detail"
          name="address_detail"
          type="text"
          maxLength={200}
          placeholder="상세주소 (동/호수 등)"
          aria-label="상세주소"
          autoComplete="address-line2"
        />
      </div>

      <label>
        배송 요청사항
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) setNote(e.target.value);
          }}
          aria-label="배송 요청사항 선택"
        >
          <option value="">자주 쓰는 요청사항 선택</option>
          {NOTE_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
        <textarea
          name="delivery_note"
          rows={3}
          maxLength={200}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="직접 입력할 수도 있어요. (선택)"
        />
      </label>

      <TossPaymentWidget amount={amount} onReady={setWidgets} />

      <button className="button dark" type="submit" disabled={sending || !widgets}>
        {sending ? "결제 진행 중" : "결제하기"}
      </button>
      {error ? (
        <p className="form-status error" role="status">
          {error}
        </p>
      ) : null}
    </form>
  );
}
