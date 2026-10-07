import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackEcommerce } from "@/components/track-ecommerce";
import { ecommerceItem } from "@/lib/analytics";
import { readCart } from "@/lib/cart";
import { getProductBySlug, getProductsByIds, type Product } from "@/lib/products";
import { clampQuantity, formatPrice } from "@/lib/shop";

export const metadata: Metadata = { title: "주문서 — VEIL" };

type Props = { searchParams: Promise<{ product?: string; qty?: string }> };

export default async function CheckoutPage({ searchParams }: Props) {
  const { product: slug, qty } = await searchParams;

  let items: { product: Product; quantity: number }[] = [];
  let direct: { productId: string; quantity: number } | undefined;

  if (slug) {
    const product = await getProductBySlug(slug);
    if (product) {
      const quantity = clampQuantity(Number(qty ?? 1));
      items = [{ product, quantity }];
      direct = { productId: product.id, quantity };
    }
  } else {
    const lines = await readCart();
    const products = await getProductsByIds(lines.map((line) => line.productId));
    items = lines.flatMap((line) => {
      const product = products.find((p) => p.id === line.productId);
      return product ? [{ product, quantity: line.quantity }] : [];
    });
  }

  if (items.length === 0) redirect("/cart");

  const ecommerceItems = items.map(({ product, quantity }) => ecommerceItem(product, quantity));
  const total = ecommerceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap narrow">
        <TrackEcommerce event="begin_checkout" items={ecommerceItems} value={total} />
        <h1 className="page-title">주문서</h1>
        <section aria-labelledby="order-items">
          <h2 id="order-items" className="section-title">
            주문 상품
          </h2>
          <ul className="order-summary">
            {items.map(({ product, quantity }) => (
              <li key={product.id}>
                <span>
                  {product.name}
                  {product.volume ? ` · ${product.volume}` : ""} × {quantity}
                </span>
                <strong>{formatPrice(product.price * quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="purchase-total">
            <span>총 결제 예정 금액</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <p className="fine">테스트 결제 환경입니다. 실제 금액은 청구되지 않습니다.</p>
        </section>
        <section aria-labelledby="order-shipping">
          <h2 id="order-shipping" className="section-title">
            배송 정보
          </h2>
          <CheckoutForm
            mode={direct ? "direct" : "cart"}
            productId={direct?.productId}
            quantity={direct?.quantity}
            amount={total}
            items={ecommerceItems}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
