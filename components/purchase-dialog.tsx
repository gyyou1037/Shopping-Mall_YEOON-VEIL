"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.chamsae.art";

type FormStatus = "idle" | "sending" | "sent" | "error";

export function PurchaseDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => {
      document.body.classList.remove("modal-open");
      setStatus("idle");
      setMessage("");
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  function openDialog() {
    dialogRef.current?.showModal();
    document.body.classList.add("modal-open");
  }

  function closeOnBackdrop(event: React.MouseEvent<HTMLDialogElement>) {
    const dialog = dialogRef.current;
    if (!dialog || event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (outside) dialog.close();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          content: String(data.get("content") ?? ""),
        }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        detail?: string;
        errors?: string[];
      };
      if (!response.ok) {
        const errors = Array.isArray(body.errors) ? body.errors.filter(Boolean).join(" ") : body.detail;
        setStatus("error");
        setMessage(
          response.status === 503
            ? "지금은 문의를 접수하지 못하고 있습니다. 잠시 후 다시 시도해 주세요."
            : errors || "문의를 보내지 못했습니다.",
        );
        return;
      }
      form.reset();
      setStatus("sent");
      setMessage("문의가 접수되었습니다. 남겨 주신 내용으로 안내드리겠습니다.");
    } catch {
      setStatus("error");
      setMessage("문의 서버에 연결하지 못했습니다.");
    }
  }

  return (
    <>
      <button className="button dark" type="button" onClick={openDialog}>
        제품 및 구매 안내
      </button>
      <dialog ref={dialogRef} aria-labelledby="info-title" onClick={closeOnBackdrop}>
        <button className="close" type="button" onClick={() => dialogRef.current?.close()} aria-label="구매 안내 닫기">
          ×
        </button>
        <p className="eyebrow">THE VEIL SERUM</p>
        <h2 id="info-title">문의하기</h2>
        <p>
          제품의 가격, 용량, 전성분과
          <br />
          판매 일정이 준비 중입니다.
        </p>
        <p className="muted">주문이나 결제는 진행되지 않습니다. 궁금한 점은 아래로 남겨 주세요.</p>
        <form className="inquiry-form" onSubmit={onSubmit}>
          <label>
            이름
            <input name="name" type="text" required maxLength={80} autoComplete="name" />
          </label>
          <label>
            이메일
            <input name="email" type="email" required maxLength={254} autoComplete="email" />
          </label>
          <label>
            문의 내용
            <textarea name="content" required maxLength={2000} rows={4} />
          </label>
          <button className="button dark" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "보내는 중" : "문의 보내기"}
          </button>
          {message ? (
            <p className={status === "error" ? "form-status error" : "form-status"} role="status">
              {message}
            </p>
          ) : null}
        </form>
      </dialog>
    </>
  );
}
