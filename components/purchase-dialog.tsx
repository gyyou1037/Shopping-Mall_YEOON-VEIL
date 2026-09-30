"use client";

import { useEffect, useRef } from "react";

export function PurchaseDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => document.body.classList.remove("modal-open");
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
        <h2 id="info-title">곧, 더 가까이.</h2>
        <p>
          제품의 가격, 용량, 전성분과
          <br />
          판매 일정이 준비 중입니다.
        </p>
        <p className="muted">
          현재는 브랜드와 제품 이미지를 살펴보실 수 있으며, 주문이나 결제는 진행되지 않습니다.
        </p>
        <button className="button dark" type="button" onClick={() => dialogRef.current?.close()}>
          계속 둘러보기
        </button>
      </dialog>
    </>
  );
}
