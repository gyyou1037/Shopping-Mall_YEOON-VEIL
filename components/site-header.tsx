"use client";

import { useEffect, useId, useState } from "react";

const links = [
  { href: "#story", label: "브랜드 이야기" },
  { href: "#serum", label: "VEIL 세럼" },
  { href: "#ritual", label: "데일리 리추얼" },
  { href: "#journal", label: "저널" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 641px)");
    const close = () => setOpen(false);
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="header">
      <a className="logo" href="#main" aria-label="VEIL 홈">
        VEIL
      </a>
      <nav id={menuId} className={open ? "is-open" : undefined} aria-label="메인 메뉴">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="header-shop" href="#serum">
        제품 만나보기
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        메뉴 <span aria-hidden="true">☰</span>
      </button>
    </header>
  );
}
