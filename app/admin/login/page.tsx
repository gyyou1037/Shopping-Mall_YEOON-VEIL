import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isAdmin } from "@/lib/admin-session";

export const metadata: Metadata = { title: "관리자 로그인 — VEIL" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <>
      <SiteHeader />
      <main id="main" className="shop-page wrap narrow">
        <h1 className="page-title">관리자 로그인</h1>
        <AdminLoginForm />
      </main>
      <SiteFooter />
    </>
  );
}
