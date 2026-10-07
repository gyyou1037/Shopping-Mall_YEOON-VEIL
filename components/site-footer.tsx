import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer wrap">
      <div>
        <Link className="logo" href="/">
          VEIL
        </Link>
        <p>
          빛, 여백, 그리고 나.
          <br />
          THE ART OF EVERYDAY CARE.
        </p>
      </div>
      <div className="footer-links">
        <Link href="/#story">브랜드 이야기</Link>
        <Link href="/#ritual">사용 가이드</Link>
        <Link href="/#faq">고객 안내</Link>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VEIL. All rights reserved.</span>
      </div>
    </footer>
  );
}
