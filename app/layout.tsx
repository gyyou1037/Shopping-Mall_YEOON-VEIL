import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEIL — 나를 위한 빛의 시간",
  description: "일상에 스며드는 고요한 스킨케어 리추얼. 빛과 여백으로 만나는 VEIL 세럼.",
};

export const viewport: Viewport = {
  themeColor: "#f6f2e9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
