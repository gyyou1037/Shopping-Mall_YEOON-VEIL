import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Photo } from "@/components/photo";
import { ProductPurchase } from "@/components/product-purchase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/shop";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} — VEIL` : "VEIL" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap">
        <nav className="breadcrumb" aria-label="현재 위치">
          <Link href="/">홈</Link> / <span>{product.name}</span>
        </nav>
        <section className="detail">
          <div className="detail-visual">
            <Photo src={product.image} width={1024} height={1024} alt={`${product.name} 제품 이미지`} priority />
          </div>
          <div className="detail-copy">
            <p className="eyebrow">THE EVERYDAY ESSENTIAL</p>
            <h1 className="detail-title">
              <span className="serif">{product.name}</span>
              {product.subtitle ? <small>{product.subtitle}</small> : null}
            </h1>
            <p className="detail-price">{formatPrice(product.price)}</p>
            <dl className="detail-meta">
              {product.volume ? (
                <div>
                  <dt>용량</dt>
                  <dd>{product.volume}</dd>
                </div>
              ) : null}
              <div>
                <dt>배송</dt>
                <dd>주문 접수 후 안내</dd>
              </div>
            </dl>
            <p className="muted">
              화장대 위에 놓인 작은 여유. 하루의 시작과 끝에, 피부를 살피고 나에게 집중하는 시간을 더해보세요.
            </p>
            <ProductPurchase productId={product.id} slug={product.slug} price={product.price} />
            <p className="fine">
              가격과 용량은 임시 정보이며, 전성분과 상세 정보는 준비 중입니다. 현재는 결제 없이 주문만 접수됩니다.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
