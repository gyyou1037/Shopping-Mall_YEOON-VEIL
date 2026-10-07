"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProduct } from "@/app/actions/admin";

export function ProductForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    setError("");
    setDone("");
    const result = await createProduct(new FormData(form));
    setSending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    form.reset();
    setDone("상품을 등록했습니다.");
    router.refresh();
  }

  return (
    <form className="inquiry-form" onSubmit={onSubmit}>
      <label>
        상품 이름
        <input name="name" type="text" required maxLength={80} />
      </label>
      <label>
        슬러그
        <input
          name="slug"
          type="text"
          required
          maxLength={60}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          placeholder="veil-cream"
          autoCapitalize="none"
          spellCheck={false}
        />
      </label>
      <label>
        부제
        <input name="subtitle" type="text" maxLength={80} placeholder="선택" />
      </label>
      <label>
        용량
        <input name="volume" type="text" maxLength={40} placeholder="30ml" />
      </label>
      <label>
        가격 (원)
        <input name="price" type="number" required min={1} max={10000000} step={1} inputMode="numeric" />
      </label>
      <label>
        이미지
        <input name="image" type="file" required accept="image/jpeg,image/png,image/webp" />
      </label>
      <button className="button dark" type="submit" disabled={sending}>
        {sending ? "등록 중" : "상품 등록"}
      </button>
      {error ? (
        <p className="form-status error" role="status">
          {error}
        </p>
      ) : null}
      {done ? (
        <p className="form-status" role="status">
          {done}
        </p>
      ) : null}
    </form>
  );
}
