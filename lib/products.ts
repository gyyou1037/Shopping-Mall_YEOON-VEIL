import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  volume: string | null;
  price: number;
  image: string;
};

const COLUMNS = "id, slug, name, subtitle, volume, price, image";

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select(COLUMNS).eq("slug", slug).maybeSingle();
  return data;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("products").select(COLUMNS).in("id", ids);
  return data ?? [];
}
