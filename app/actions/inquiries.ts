"use server";

import { createClient } from "@/lib/supabase/server";

export type InquiryResult = { ok: true } | { ok: false; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;

export async function submitInquiry(formData: FormData): Promise<InquiryResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!name || name.length > 80) {
    return { ok: false, message: "이름을 80자 이내로 입력해 주세요." };
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, message: "올바른 이메일 주소를 입력해 주세요." };
  }
  if (!content || content.length > 2000) {
    return { ok: false, message: "문의 내용을 2000자 이내로 입력해 주세요." };
  }

  const supabase = await createClient();
  // RLS grants insert only, so chaining .select() here would fail.
  const { error } = await supabase.from("inquiries").insert({ name, email, content });

  if (error) {
    console.error("Failed to save inquiry", error);
    return { ok: false, message: "문의를 보내지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  return { ok: true };
}
