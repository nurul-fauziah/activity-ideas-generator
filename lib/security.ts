import crypto from "crypto";

// ============================================================================
// 1. In-Memory Sliding-Window Rate Limiter
// ============================================================================
interface RateLimitRecord {
  timestamps: number[];
  lockoutUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Memeriksa apakah IP/identifier melampaui batas permintaan dalam interval waktu tertentu.
 * Jika melampaui limit, IP akan di-lockout sementara.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15 menit
  lockoutMs: number = 15 * 60 * 1000 // 15 menit penalti lockout
): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Cek apakah masih dalam status lockout
  if (record.lockoutUntil && record.lockoutUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  // Hapus timestamp yang sudah di luar rentang sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxAttempts) {
    // Kunci IP jika melampaui percobaan
    record.lockoutUntil = now + lockoutMs;
    const retryAfterSeconds = Math.ceil(lockoutMs / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  // Catat percobaan ini
  record.timestamps.push(now);

  // Bersihkan store secara periodik jika membesar (memory hygiene)
  if (rateLimitStore.size > 2000) {
    const cutoff = now - windowMs;
    for (const [storeKey, r] of rateLimitStore.entries()) {
      if ((!r.lockoutUntil || r.lockoutUntil < now) && r.timestamps.every((t) => t < cutoff)) {
        rateLimitStore.delete(storeKey);
      }
    }
  }

  return {
    allowed: true,
    remaining: maxAttempts - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Reset catatan percobaan untuk key tertentu (misal setelah login berhasil)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

// ============================================================================
// 2. Timing-Safe String Comparison (Cegah Serangan Side-Channel / Timing Attack)
// ============================================================================
export function timingSafePinCompare(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;

  // Hashing kedua string dengan SHA-256 menghasilkan buffer dengan panjang yang persis sama (32 bytes)
  const hashProvided = crypto.createHash("sha256").update(provided).digest();
  const hashExpected = crypto.createHash("sha256").update(expected).digest();

  return crypto.timingSafeEqual(hashProvided, hashExpected);
}

// ============================================================================
// 3. Sanitasi Teks Anti-XSS (HTML Tag & Script Stripping)
// ============================================================================
export function sanitizeTextInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    // Hapus script tags beserta isinya
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Hapus style tags beserta isinya
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Hapus semua HTML tags lain
    .replace(/<[^>]+>/g, "")
    // Hapus pola pseudo-protokol berbahaya
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .replace(/vbscript:/gi, "")
    .trim();
}

// ============================================================================
// 4. Verifikasi Same-Origin & Anti-CSRF
// ============================================================================
export function validateSameOrigin(request: Request): {
  valid: boolean;
  reason?: string;
} {
  // 1. Cek Sec-Fetch-Site jika browser mengirimkannya
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return { valid: false, reason: "Akses ditolak: Permintaan lintas-origin (cross-site) terdeteksi." };
  }

  // 2. Cek Origin Header
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return { valid: false, reason: "Akses ditolak: Nilai Origin header tidak sesuai dengan host server." };
      }
    } catch {
      return { valid: false, reason: "Akses ditolak: Format Origin header tidak valid." };
    }
  }

  return { valid: true };
}

// ============================================================================
// 5. Ekstraksi Client IP Aman
// ============================================================================
export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}
