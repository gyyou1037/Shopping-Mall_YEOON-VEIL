import { getObject } from "@/lib/r2";

const FILE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

type Props = { params: Promise<{ file: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { file } = await params;
  if (!FILE.test(file)) return new Response("Not found", { status: 404 });

  const object = await getObject(`products/${file}`);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": object.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
