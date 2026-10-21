/**
 * S3-compatible object storage for the media library.
 *
 * Works with Cloudflare R2, AWS S3, MinIO, etc. We sign requests with
 * aws4fetch (small, fetch-based) instead of the full AWS SDK, and always use
 * path-style URLs (`<endpoint>/<bucket>/<key>`), which R2 and MinIO support.
 *
 * Required env:
 *   S3_ENDPOINT         e.g. https://<account>.r2.cloudflarestorage.com
 *   S3_BUCKET
 *   S3_ACCESS_KEY_ID
 *   S3_SECRET_ACCESS_KEY
 *   S3_PUBLIC_BASE_URL  e.g. https://cdn.bqzn.top
 *   S3_REGION           optional, default "auto" (R2)
 */
import { AwsClient } from "aws4fetch"

const ENDPOINT = (process.env.S3_ENDPOINT || "").replace(/\/+$/, "")
const BUCKET = process.env.S3_BUCKET || ""
const REGION = process.env.S3_REGION || "auto"
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || ""
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || ""
const PUBLIC_BASE_URL = (process.env.S3_PUBLIC_BASE_URL || "").replace(/\/+$/, "")

export function isObjectStorageConfigured(): boolean {
  return Boolean(
    ENDPOINT &&
      BUCKET &&
      ACCESS_KEY_ID &&
      SECRET_ACCESS_KEY &&
      PUBLIC_BASE_URL
  )
}

function assertConfigured() {
  if (!isObjectStorageConfigured()) {
    throw new Error(
      "对象存储未配置：请设置 S3_ENDPOINT / S3_BUCKET / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY / S3_PUBLIC_BASE_URL"
    )
  }
}

function encodeKey(key: string): string {
  return key
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/")
}

function objectUrl(key: string): string {
  return `${ENDPOINT}/${encodeURIComponent(BUCKET)}/${encodeKey(key)}`
}

function s3Client(): AwsClient {
  assertConfigured()
  return new AwsClient({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    service: "s3",
    region: REGION,
  })
}

/** Public URL for an object (served by R2/S3 public domain or CDN). */
export function getPublicUrl(key: string): string {
  assertConfigured()
  return `${PUBLIC_BASE_URL}/${encodeKey(key)}`
}

/** Upload a file. Throws on non-2xx responses. */
export async function putObject(
  key: string,
  bytes: Uint8Array,
  contentType: string
): Promise<void> {
  const response = await s3Client().fetch(objectUrl(key), {
    method: "PUT",
    body: bytes as BodyInit,
    headers: {
      "Content-Type": contentType || "application/octet-stream",
      // Object keys are content-addressed enough (timestamp + random), so the
      // CDN can cache them forever. Replacing a file creates a new key.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(
      `对象存储上传失败 (${response.status}) ${body.slice(0, 200)}`
    )
  }
}

/** Delete an object. Missing objects are treated as success. */
export async function deleteObject(key: string): Promise<void> {
  const response = await s3Client().fetch(objectUrl(key), { method: "DELETE" })
  if (!response.ok && response.status !== 404) {
    const body = await response.text().catch(() => "")
    throw new Error(
      `对象存储删除失败 (${response.status}) ${body.slice(0, 200)}`
    )
  }
}

/** Extract the object key from a public URL, or null if it is not ours. */
export function keyFromPublicUrl(url: string): string | null {
  if (!PUBLIC_BASE_URL || !url.startsWith(`${PUBLIC_BASE_URL}/`)) return null
  const encoded = url.slice(PUBLIC_BASE_URL.length + 1)
  try {
    return encoded
      .split("/")
      .map((part) => decodeURIComponent(part))
      .join("/")
  } catch {
    return null
  }
}

/** Build a collision-resistant key for an uploaded file. */
export function buildObjectKey(originalName: string): string {
  const now = new Date()
  const yyyy = now.getUTCFullYear()
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0")
  const ext = originalName.includes(".")
    ? originalName.slice(originalName.lastIndexOf(".")).toLowerCase()
    : ""
  return `uploads/${yyyy}/${mm}/${crypto.randomUUID()}${ext}`
}
