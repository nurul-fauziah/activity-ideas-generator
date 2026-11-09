import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import initialActivities from "@/data/activities.json";
import { Activity, CategoryId, Rarity, SocialMode, PlaceMode, DeviceMode } from "@/types/activity";
import {
  checkRateLimit,
  resetRateLimit,
  timingSafePinCompare,
  sanitizeTextInput,
  validateSameOrigin,
  getClientIp,
} from "@/lib/security";

const ALLOWED_CATEGORIES = new Set<string>([
  "senang-senang",
  "self-improvement",
  "tech",
  "psikologi",
  "matematika",
  "game",
  "kreatif",
  "fisik",
  "sosial",
]);

const ALLOWED_RARITIES = new Set<string>(["common", "rare", "epic", "legendary"]);
const ALLOWED_SOCIAL = new Set<string>(["solo", "group", "bareng"]);
const ALLOWED_PLACE = new Set<string>(["indoor", "outdoor"]);
const ALLOWED_DEVICE = new Set<string>(["none", "phone", "laptop", "tanpa-alat", "hp"]);

const ID_REGEX = /^[a-z0-9-]+$/;
const MAX_PAYLOAD_BYTES = 512 * 1024; // 512 KB

// GET: Ambil katalog aktivitas
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "activities.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const activities = JSON.parse(fileContent) as Activity[];
    return NextResponse.json({
      success: true,
      activities,
      isLocalFile: true,
    });
  } catch {
    // Fallback bersih tanpa membocorkan path server
    return NextResponse.json({
      success: true,
      activities: initialActivities as Activity[],
      isLocalFile: false,
    });
  }
}

// POST: Simpan katalog aktivitas dengan Hardening Siber Menyeluruh
export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  try {
    // 1. Perlindungan Anti-CSRF / Same-Origin Check
    const originCheck = validateSameOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          message: originCheck.reason || "Akses ditolak: Permintaan lintas origin dilarang.",
        },
        { status: 403 }
      );
    }

    // 2. Perlindungan Anti-DoS: Periksa Batas Ukuran Payload (Content-Length)
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran data melampaui batas maksimum yang diizinkan (maksimal 512 KB).",
        },
        { status: 413 }
      );
    }

    // 3. Perlindungan Anti-Brute Force: Cek Batas Percobaan & Lockout IP
    const rateLimitKey = `admin-pin:${clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      const minutesRemaining = Math.ceil(rateLimit.retryAfterSeconds / 60);
      return NextResponse.json(
        {
          success: false,
          message: `Terlalu banyak percobaan autentikasi gagal. Akses dari IP Anda dikunci sementara selama ${minutesRemaining} menit untuk keamanan.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    // 4. Verifikasi PIN Menggunakan Timing-Safe Comparison (Cegah Serangan Side-Channel)
    const expectedPin = process.env.ADMIN_PIN || "1234";
    const providedPin = request.headers.get("x-admin-pin")?.trim() || "";

    const isPinValid = timingSafePinCompare(providedPin, expectedPin);

    if (!isPinValid) {
      return NextResponse.json(
        {
          success: false,
          message: `Akses ditolak: PIN admin tidak valid. Sisa kesempatan sebelum terkunci: ${rateLimit.remaining} kali.`,
        },
        { status: 401 }
      );
    }

    // Jika PIN valid, bersihkan catatan percobaan gagal untuk IP ini
    resetRateLimit(rateLimitKey);

    // 5. Validasi Struktur & Batasan Array
    const body = (await request.json()) as { activities?: unknown };
    const rawList = body.activities;

    if (!Array.isArray(rawList)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format data tidak valid: properti 'activities' harus berupa array.",
        },
        { status: 400 }
      );
    }

    if (rawList.length === 0 || rawList.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Jumlah misi di luar batas wajar (minimal 1, maksimal 200 misi).",
        },
        { status: 400 }
      );
    }

    // 6. Sanitasi & Validasi Mendalam Anti-XSS untuk Setiap Entri
    const sanitizedActivities: Activity[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i] as Partial<Activity>;

      if (!item || typeof item !== "object") {
        return NextResponse.json(
          { success: false, message: `Data misi pada urutan ke-${i + 1} tidak valid.` },
          { status: 400 }
        );
      }

      // Validasi ID (regex huruf kecil, angka, strip)
      const rawId = typeof item.id === "string" ? sanitizeTextInput(item.id.trim()) : "";
      if (!rawId || rawId.length < 2 || rawId.length > 50 || !ID_REGEX.test(rawId)) {
        return NextResponse.json(
          {
            success: false,
            message: `ID '${rawId || "kosong"}' pada item ke-${i + 1} tidak valid. Gunakan huruf kecil, angka, dan strip (2-50 karakter).`,
          },
          { status: 400 }
        );
      }

      if (seenIds.has(rawId)) {
        return NextResponse.json(
          { success: false, message: `Duplikasi ID terdeteksi: '${rawId}'. Setiap misi wajib memiliki ID unik.` },
          { status: 400 }
        );
      }
      seenIds.add(rawId);

      // Sanitasi & Validasi Judul
      const rawTitle = typeof item.title === "string" ? sanitizeTextInput(item.title) : "";
      if (!rawTitle || rawTitle.length < 3 || rawTitle.length > 200) {
        return NextResponse.json(
          { success: false, message: `Judul pada misi '${rawId}' tidak valid (wajib 3-200 karakter).` },
          { status: 400 }
        );
      }

      // Sanitasi & Validasi Deskripsi
      const rawDesc = typeof item.description === "string" ? sanitizeTextInput(item.description) : "";
      if (!rawDesc || rawDesc.length < 5 || rawDesc.length > 1000) {
        return NextResponse.json(
          { success: false, message: `Deskripsi pada misi '${rawId}' tidak valid (wajib 5-1000 karakter).` },
          { status: 400 }
        );
      }

      // Validasi Kategori
      if (!Array.isArray(item.categories) || item.categories.length === 0 || item.categories.length > 9) {
        return NextResponse.json(
          { success: false, message: `Kategori pada misi '${rawId}' wajib dipilih minimal 1.` },
          { status: 400 }
        );
      }

      const validCategories: CategoryId[] = [];
      for (const cat of item.categories) {
        if (typeof cat === "string" && ALLOWED_CATEGORIES.has(cat)) {
          validCategories.push(cat as CategoryId);
        }
      }

      if (validCategories.length === 0) {
        return NextResponse.json(
          { success: false, message: `Misi '${rawId}' tidak memiliki kategori yang valid.` },
          { status: 400 }
        );
      }

      // Validasi Rarity
      const rarity: Rarity =
        typeof item.rarity === "string" && ALLOWED_RARITIES.has(item.rarity)
          ? (item.rarity as Rarity)
          : "common";

      // Validasi Angka: XP, Coins, Duration
      const xp = Math.min(Math.max(Math.round(Number(item.xp) || 25), 5), 500);
      const coins = Math.min(Math.max(Math.round(Number(item.coins) || 10), 1), 200);
      const durationMin = Math.min(Math.max(Math.round(Number(item.duration_min) || 15), 1), 300);

      // Validasi Mode
      const social: SocialMode =
        typeof item.social === "string" && ALLOWED_SOCIAL.has(item.social)
          ? (item.social as SocialMode)
          : "solo";

      const place: PlaceMode =
        typeof item.place === "string" && ALLOWED_PLACE.has(item.place)
          ? (item.place as PlaceMode)
          : "indoor";

      const device: DeviceMode =
        typeof item.device === "string" && ALLOWED_DEVICE.has(item.device)
          ? (item.device as DeviceMode)
          : "none";

      const needsInternet = Boolean(item.needs_internet);

      // Sanitasi & Validasi Langkah-langkah Petunjuk
      const validSteps: string[] = [];
      if (Array.isArray(item.steps)) {
        for (const st of item.steps) {
          if (typeof st === "string") {
            const cleanSt = sanitizeTextInput(st);
            if (cleanSt.length > 0 && cleanSt.length <= 300) {
              validSteps.push(cleanSt);
            }
          }
        }
      }

      if (validSteps.length === 0) {
        return NextResponse.json(
          { success: false, message: `Misi '${rawId}' wajib memiliki minimal 1 langkah petunjuk.` },
          { status: 400 }
        );
      }

      // Sanitasi Catatan Bebas Biaya
      const freeNotes =
        item.free_check && typeof item.free_check.notes === "string"
          ? sanitizeTextInput(item.free_check.notes).slice(0, 300)
          : "100% Free";

      sanitizedActivities.push({
        id: rawId,
        title: rawTitle,
        description: rawDesc,
        categories: validCategories,
        rarity,
        xp,
        coins,
        duration_min: durationMin,
        social,
        place,
        device,
        needs_internet: needsInternet,
        steps: validSteps.slice(0, 15),
        free_check: {
          verified: true,
          notes: freeNotes || "Bebas biaya tanpa alat khusus",
        },
      });
    }

    // 7. Tulis ke file disk lokal secara aman
    const filePath = path.join(process.cwd(), "data", "activities.json");
    await fs.writeFile(filePath, JSON.stringify(sanitizedActivities, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      count: sanitizedActivities.length,
      message: `Berhasil menyimpan ${sanitizedActivities.length} misi ke data/activities.json!`,
    });
  } catch {
    // Tangani error tanpa membocorkan path atau informasi server sensitif
    return NextResponse.json(
      {
        success: false,
        isReadOnly: true,
        message: "Tidak dapat menulis langsung ke server (lingkungan read-only atau izin akses terbatas). Silakan gunakan tombol 'Unduh JSON'.",
      },
      { status: 500 }
    );
  }
}
