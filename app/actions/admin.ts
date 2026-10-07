"use server";

import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, isAdmin } from "@/lib/admin-session";
import { deleteObject, putObject } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

export type ProductResult = { ok: true; slug: string } | { ok: false; message: string };

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const IMAGE_KINDS = {
  "image/jpeg": {
    ext: "jpg",
    matches: (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  "image/png": {
    ext: "png",
    matches: (bytes: Uint8Array) =>
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47,
  },
  "image/webp": {
    ext: "webp",
    matches: (bytes: Uint8Array) =>
      bytes.length > 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50,
  },
} as const;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function same(left: string, right: string) {
  const secret = process.env.ORDER_ADMIN_SECRET ?? "missing-admin-secret";
  const a = createHmac("sha256", secret).update(left).digest();
  const b = createHmac("sha256", secret).update(right).digest();
  return timingSafeEqual(a, b);
}

export async function loginAdmin(formData: FormData): Promise<{ ok: false; message: string }> {
  const username = text(formData, "username");
  const password = text(formData, "password");
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    return { ok: false, message: "관리자 설정이 없습니다." };
  }
  if (!same(username, expectedUser) || !same(password, expectedPassword)) {
    return { ok: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

function failureMessage(error: { code?: string; message?: string }) {
  if (error.code === "23505") return "이미 사용 중인 슬러그입니다.";
  if (error.message === "invalid slug") return "슬러그는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.";
  if (error.message === "invalid name") return "상품 이름을 80자 이내로 입력해 주세요.";
  if (error.message === "invalid price") return "가격은 1원 이상인 정수로 입력해 주세요.";
  if (error.message === "invalid image") return "이미지 형식이 올바르지 않습니다.";
  return "상품을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export async function createProduct(formData: FormData): Promise<ProductResult> {
  if (!(await isAdmin())) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  const name = text(formData, "name");
  const slug = text(formData, "slug").toLowerCase();
  const subtitle = text(formData, "subtitle");
  const volume = text(formData, "volume");
  const price = Number(text(formData, "price"));
  const file = formData.get("image");

  if (!name || name.length > 80) return { ok: false, message: "상품 이름을 80자 이내로 입력해 주세요." };
  if (!SLUG.test(slug) || slug.length > 60) {
    return { ok: false, message: "슬러그는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다." };
  }
  if (subtitle.length > 80 || volume.length > 40) {
    return { ok: false, message: "부제와 용량은 각각 80자, 40자 이내로 입력해 주세요." };
  }
  if (!Number.isInteger(price) || price < 1 || price > 10_000_000) {
    return { ok: false, message: "가격은 1원 이상인 정수로 입력해 주세요." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "상품 이미지를 선택해 주세요." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: "이미지는 5MB 이하만 올릴 수 있습니다." };
  }
  const kind = IMAGE_KINDS[file.type as keyof typeof IMAGE_KINDS];
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!kind || !kind.matches(bytes)) {
    return { ok: false, message: "JPEG, PNG, WebP 이미지만 올릴 수 있습니다." };
  }

  const id = randomUUID();
  const objectKey = `products/${id}.${kind.ext}`;
  const image = `/media/${objectKey}`;
  const secret = process.env.ORDER_ADMIN_SECRET;
  if (!secret) return { ok: false, message: "상품을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요." };

  try {
    await putObject(objectKey, bytes, file.type);
  } catch {
    return { ok: false, message: "이미지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_product", {
    p_secret: secret,
    p_slug: slug,
    p_name: name,
    p_subtitle: subtitle,
    p_volume: volume,
    p_price: price,
    p_image: image,
  });
  if (error) {
    console.error("Failed to create product", error.code, error.message);
    await deleteObject(objectKey);
    return { ok: false, message: failureMessage(error) };
  }
  return { ok: true, slug };
}
