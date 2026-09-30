"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Photo } from "@/components/photo";

const moments = [
  {
    src: "/images/image-03.jpg",
    alt: "햇빛과 그림자가 머무는 세럼 보틀",
    label: "01 / LIGHT",
    action: "빛과 보틀 이미지 확대",
  },
  {
    src: "/images/image-02.jpg",
    alt: "자연광 아래 고요한 순간을 보내는 모델",
    label: "02 / STILLNESS",
    action: "고요한 오후 이미지 확대",
  },
  {
    src: "/images/image-07.jpg",
    alt: "대리석과 크림색 패브릭 위 VEIL 세럼",
    label: "03 / RITUAL",
    action: "일상의 리추얼 이미지 확대",
    width: 2400,
    height: 1345,
  },
];

export function GallerySection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<(typeof moments)[number] | null>(null);
  const [openToken, setOpenToken] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => document.body.classList.remove("modal-open");
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  useLayoutEffect(() => {
    if (openToken === 0) return;
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.body.classList.add("modal-open");
  }, [openToken]);

  function openMoment(moment: (typeof moments)[number]) {
    setSelected(moment);
    setOpenToken((current) => current + 1);
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
    <section className="gallery section wrap" id="gallery">
      <div className="section-heading">
        <div>
          <p className="eyebrow">MOMENTS WITH VEIL</p>
          <h2>빛으로 기록한 순간들.</h2>
        </div>
        <p className="fine">이미지를 눌러 크게 만나보세요.</p>
      </div>
      <div className="gallery-grid">
        {moments.map((moment) => (
          <button key={moment.src} type="button" aria-label={moment.action} onClick={() => openMoment(moment)}>
            <Photo
              src={moment.src}
              alt={moment.alt}
              width={moment.width ?? 1024}
              height={moment.height ?? 1024}
            />
            <span>{moment.label}</span>
          </button>
        ))}
      </div>
      <dialog ref={dialogRef} className="lightbox" aria-label="VEIL 이미지 크게 보기" onClick={closeOnBackdrop}>
        <button className="close" type="button" onClick={() => dialogRef.current?.close()} aria-label="이미지 닫기">
          ×
        </button>
        {selected ? (
          <Photo src={selected.src} alt={selected.alt} width={selected.width ?? 1024} height={selected.height ?? 1024} />
        ) : null}
        <p>{selected?.alt}</p>
      </dialog>
    </section>
  );
}
