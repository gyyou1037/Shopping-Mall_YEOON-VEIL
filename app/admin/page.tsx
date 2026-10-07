import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "@/app/actions/admin";
import { Photo } from "@/components/photo";
import { ProductForm } from "@/components/product-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isAdmin } from "@/lib/admin-session";
import { listProducts } from "@/lib/products";
import { formatPrice } from "@/lib/shop";

export const metadata: Metadata = { title: "상품 등록 — VEIL" };

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const products = await listProducts();

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap narrow">
        <div className="admin-bar">
          <h1 className="page-title">상품 등록</h1>
          <form action={logoutAdmin}>
            <button className="button" type="submit">
              로그아웃
            </button>
          </form>
        </div>
        <ProductForm />
        <h2 className="section-title">등록된 상품</h2>
        {products.length === 0 ? (
          <p className="muted">등록된 상품이 없습니다.</p>
        ) : (
          <ul className="admin-products">
            {products.map((product) => (
              <li key={product.id}>
                <Photo src={product.image} alt="" width={64} height={64} />
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
                <span>{formatPrice(product.price)}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
