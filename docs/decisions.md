# Keputusan Proyek

Format: tanggal, keputusan, alasan. Satu entri per keputusan non-obvious.

- **2026-11-08**: Pemisahan `SKILL.md` menjadi 5 file modular di `.agents/rules/` (`taste-core-principles.md`, `taste-design-workflow.md`, `taste-house-rules.md`, `taste-craft-laws.md`, `taste-special-cases-tooling.md`).
  *Alasan*: Memenuhi batas ukuran file Antigravity Rules (< 24 KB per file) dan memungkinkan injeksi modular rules yang rapi dan terstruktur.

- **2026-11-08**: Pemilihan Arsitektur Opsi A (Next.js Static Generation + Client-side Generator State + LocalStorage).
  *Alasan*: Sesuai rekomendasi PRD Bagian A Section 10. Tidak memerlukan server database berbayar, waktu respons instan (< 100ms), privasi terjaga (tanpa akun/cookie), dan dapat di-deploy tanpa biaya di Vercel/Netlify/Cloudflare Pages.

- **2026-11-08**: Penggunaan Tailwind v4 dengan plugin `@tailwindcss/postcss` dan token CSS Variables `:root` & `.dark`.
  *Alasan*: Menjamin konsistensi warna (Light `#FFFBF5` / Dark `#14121A`) dan mematuhi aturan anti-slop (dilarang hardcode hex dan arbitrary class di komponen).

- **2026-11-08**: Ikonografi murni menggunakan Lucide React dengan pemetaan ikon semantik per kategori (Smile, Sprout, Terminal, Brain, Calculator, Gamepad2, Palette, Activity, Users).
  *Alasan*: Mematuhi aturan keras anti-slop (dilarang emoji sebagai ikon, dilarang ikon sparkle dekoratif, dan dilarang status dot di depan badge).

- **2026-11-08**: Prioritas Kategori Utama (*Primary Category Priority*) dalam Generator & Pembersihan Cross-Tagging.
  *Alasan*: Mencegah aktivitas teknis/coding (misal: `tech-003`) muncul saat pengguna hanya memfilter kategori santai (`senang-senang`), serta memastikan badge kategori yang dipilih pengguna selalu tampil sebagai prioritas utama di kartu aktivitas.

- **2026-11-08**: Eksekusi Redesign Total Fase 1 & Fase 2: Mesin Gacha Kapsul, CoinPicker (Mystery Coin), RarityFrame, MissionCard, dan Loading Sequence Gacha.
  *Alasan*: Mengubah pengalaman generik menjadi game arcade gacha yang adiktif, playful, dan memiliki diferensiasi tinggi dengan mascot Pip, animasi loading pengocokan kapsul, bobot rarity, dan XP reward.

- **2026-11-08**: Eksekusi Fase 3: Master GSAP Timeline, Web Audio Retro Synthesis Murni, dan Animasi Retak Kapsul (*Cracking Sequence*).
  *Alasan*: Menghadirkan feedback fisik toy-capsule yang memuaskan (koin masuk -> tuas berputar -> globe bergetar -> kapsul jatuh -> retak membelah). Audio disintesis 100% di browser dengan Web Audio API tanpa dependensi file audio eksternal sehingga cepat, nol latensi, dan senyap saat tombol Mute aktif.

- **2026-11-08**: Penghapusan Konsep Dadu & Pembersihan Anti-Slop (0 Emoji/Stiker, 0 Sparkles, dan Larangan Eyebrow di Hero).
  *Alasan*: Sesuai masukan pengguna, konsep dadu di dalam globe terasa mengganggu dan bising; diganti dengan vortex putaran arcade dan icon semantik `Shuffle` untuk Acak Total. Eyebrow badge yang mengambang di atas hero dihapus dan didaftarkan sebagai aturan keras di `AGENTS.md` untuk mencegah tampilan template generik AI.

- **2026-11-08**: Eksekusi Fase 4: Gamification System, Kapsulpedia (Album 90 Kartu), Daily Spin Bonus, dan Galeri Lencana di Profil.
  *Alasan*: Menyediakan loop retensi yang adiktif. Pengguna dapat melacak 90 kartu aktivitas dengan filter multi-kategori/status/rarity, kartu terkunci tampil sebagai siluet misterius "???", putaran harian memberi jaminan kartu Rare ke atas, dan 10 lencana pencapaian memberi reward koin soft currency.

- **2026-11-08**: Eksekusi Fase 5: Mini Arcade 3 Game Interaktif (Reaction Tap, Memory Match, Math Sprint).
  *Alasan*: Memberikan variasi aktivitas instan yang bisa dimainkan langsung di web saat bosan, sekaligus menjadi wujud nyata kategori "Main Game". Skor tertinggi disimpan lokal dan membuka lencana prestasi "Jagoan Dingdong".

- **2026-11-08**: Transformasi Hasil Kapsul Menjadi Pop-Up Modal di Layar Depan dengan Backdrop Blur dan Tombol Silang (X).
  *Alasan*: Mengatasi hambatan UX di mana pengguna harus menggulir (scroll) ke bawah untuk melihat hasil kartu misi. Pop-up mengapung di viewport dengan latar belakang redup/blur, tombol X di pojok kanan atas, dukungan tombol Escape, dan scroll-lock.
