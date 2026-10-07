import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listProducts } from "@/lib/products";
import { formatPrice } from "@/lib/shop";

export const metadata: Metadata = { title: "상품 — VEIL" };

export default async function ProductsPage() {
  const products = await listProducts("oldest");

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap">
        <p className="eyebrow">THE VEIL COLLECTION</p>
        <h1 className="page-title">상품</h1>
        {products.length === 0 ? (
          <p className="muted">등록된 상품이 없습니다.</p>
        ) : (
          <ul className="catalog">
            {products.map((product) => (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`}>
                  <Photo src={product.image} alt={`${product.name} 제품 이미지`} width={800} height={800} />
                  <span className="catalog-name">{product.name}</span>
                  {product.subtitle ? <span className="catalog-sub">{product.subtitle}</span> : null}
                  <span className="catalog-price">{formatPrice(product.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
