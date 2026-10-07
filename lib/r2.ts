import "server-only";

import { createHash, createHmac } from "node:crypto";

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

function config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("R2 is not configured");
  }
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

async function signedRequest(method: "GET" | "PUT" | "DELETE", key: string, body?: Uint8Array, contentType?: string) {
  const { accountId, accessKeyId, secretAccessKey, bucket } = config();
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const uri = `/${bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;
  const now = new Date();
  const amzdate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const datestamp = amzdate.slice(0, 8);
  const payloadHash = createHash("sha256").update(body ?? new Uint8Array()).digest("hex");
  const headers: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzdate,
  };
  if (contentType) headers["content-type"] = contentType;
  const names = Object.keys(headers).sort();
  const canonicalHeaders = names.map((name) => `${name}:${headers[name]}\n`).join("");
  const signedHeaders = names.join(";");
  const canonicalRequest = [method, uri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const scope = `${datestamp}/auto/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzdate,
    scope,
    createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secretAccessKey}`, datestamp), "auto"), "s3"), "aws4_request");
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  const requestHeaders: Record<string, string> = {
    Authorization: authorization,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzdate,
  };
  if (contentType) requestHeaders["Content-Type"] = contentType;
  return fetch(`https://${host}${uri}`, {
    method,
    headers: requestHeaders,
    body: body ? Buffer.from(body) : undefined,
    cache: "no-store",
  });
}

export async function putObject(key: string, body: Uint8Array, contentType: string) {
  const response = await signedRequest("PUT", key, body, contentType);
  if (!response.ok) {
    console.error("R2 upload failed", response.status);
    throw new Error("upload failed");
  }
}

export async function deleteObject(key: string) {
  const response = await signedRequest("DELETE", key);
  if (!response.ok && response.status !== 404) {
    console.error("R2 delete failed", response.status);
  }
}

export async function getObject(key: string) {
  const response = await signedRequest("GET", key);
  if (response.status === 404) return null;
  if (!response.ok) {
    console.error("R2 read failed", response.status);
    return null;
  }
  return {
    body: new Uint8Array(await response.arrayBuffer()),
    contentType: response.headers.get("content-type") ?? "application/octet-stream",
  };
}
