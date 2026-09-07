// Site-wide single-password gate. Edge-safe (WebCrypto only) so it can be
// used from middleware as well as route handlers. The raw password is never
// stored: only its SHA-256 hex digest lives in SITE_ACCESS_PASSWORD_HASH.

const COOKIE_NAME = "site-auth"
const te = new TextEncoder()

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function getCookieName() {
  return COOKIE_NAME
}

export async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", te.encode(value)))
}

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    te.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, te.encode(data))
  return toHex(sig)
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export async function verifyPassword(
  password: string,
  expectedHash: string
): Promise<boolean> {
  const actual = await sha256Hex(password)
  return timingSafeEqualHex(
    actual.toLowerCase(),
    expectedHash.trim().toLowerCase()
  )
}

/** Create a signed `v1.<random>.<sig>` cookie value. */
export async function createSessionValue(secret: string): Promise<string> {
  const rand = toHex(crypto.getRandomValues(new Uint8Array(24)).buffer as ArrayBuffer)
  const sig = await hmacHex(secret, rand)
  return `v1.${rand}.${sig}`
}

/** Validate a `v1.<random>.<sig>` cookie value. */
export async function verifySessionValue(
  secret: string,
  value: string | undefined | null
): Promise<boolean> {
  if (!value) return false
  const parts = value.split(".")
  if (parts.length !== 3 || parts[0] !== "v1") return false
  const [, rand, sig] = parts
  if (!rand || !sig) return false
  const expected = await hmacHex(secret, rand)
  return timingSafeEqualHex(sig.toLowerCase(), expected.toLowerCase())
}
