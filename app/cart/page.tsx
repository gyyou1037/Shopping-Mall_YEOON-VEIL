import type { Metadata } from "next";
import Link from "next/link";
import { CartItem } from "@/components/cart-item";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { readCart } from "@/lib/cart";
import { getProductsByIds } from "@/lib/products";
import { formatPrice } from "@/lib/shop";

export const metadata: Metadata = { title: "장바구니 — VEIL" };

export default async function CartPage() {
  const lines = await readCart();
  const products = await getProductsByIds(lines.map((line) => line.productId));
  const items = lines.flatMap((line) => {
    const product = products.find((p) => p.id === line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap narrow">
        <h1 className="page-title">장바구니</h1>
        {items.length === 0 ? (
          <div className="empty">
            <p className="muted">장바구니가 비어 있습니다.</p>
            <Link className="button dark" href="/products/veil-serum">
              VEIL 세럼 보러가기
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map(({ product, quantity }) => (
                <CartItem
                  key={product.id}
                  productId={product.id}
                  name={product.name}
                  volume={product.volume}
                  image={product.image}
                  price={product.price}
                  quantity={quantity}
                />
              ))}
            </ul>
            <div className="summary">
              <div className="purchase-total">
                <span>총 결제 예정 금액</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <p className="fine">현재는 결제 없이 주문만 접수됩니다. 배송비는 안내 예정입니다.</p>
              <Link className="button dark" href="/checkout">
                주문하기
              </Link>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
