"use client";

import Script from "next/script";
import { useRef, useState } from "react";

type PostcodeData = {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  userSelectedType: "R" | "J";
};

type PostcodeOptions = {
  oncomplete: (data: PostcodeData) => void;
  width: string;
  height: string;
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: PostcodeOptions) => { embed: (element: HTMLElement) => void };
    };
  }
}

type Props = {
  onSelect: (result: { zipcode: string; address: string }) => void;
};

export function AddressSearch({ onSelect }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  function open() {
    const container = containerRef.current;
    const dialog = dialogRef.current;
    if (!container || !dialog) return;
    if (!window.daum?.Postcode) {
      setError("주소 검색을 불러오는 중입니다. 잠시 후 다시 눌러 주세요.");
      return;
    }
    setError("");
    container.replaceChildren();
    dialog.showModal();
    new window.daum.Postcode({
      width: "100%",
      height: "100%",
      oncomplete(data) {
        const address =
          data.userSelectedType === "J" && data.jibunAddress
            ? data.jibunAddress
            : data.roadAddress || data.jibunAddress;
        onSelect({ zipcode: data.zonecode, address });
        dialog.close();
      },
    }).embed(container);
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
      <button className="button address-button" type="button" onClick={open}>
        주소 검색
      </button>
      {error ? (
        <p className="form-status error" role="status">
          {error}
        </p>
      ) : null}
      <dialog ref={dialogRef} className="address-dialog" aria-label="주소 검색">
        <button className="close" type="button" onClick={() => dialogRef.current?.close()} aria-label="주소 검색 닫기">
          ×
        </button>
        <div ref={containerRef} className="address-embed" />
      </dialog>
    </>
  );
}
