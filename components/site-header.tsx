"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

const links = [
  { href: "/#story", label: "브랜드 이야기" },
  { href: "/products", label: "상품" },
  { href: "/#ritual", label: "데일리 리추얼" },
  { href: "/#journal", label: "저널" },
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
      <Link className="logo" href="/" aria-label="VEIL 홈">
        VEIL
      </Link>
      <nav id={menuId} className={open ? "is-open" : undefined} aria-label="메인 메뉴">
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link className="nav-cart" href="/cart" onClick={() => setOpen(false)}>
          장바구니
        </Link>
      </nav>
      <Link className="header-shop" href="/products">
        제품 만나보기
      </Link>
      <Link className="header-cart" href="/cart">
        장바구니
      </Link>
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
