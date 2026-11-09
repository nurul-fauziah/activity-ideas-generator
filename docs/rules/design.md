# Desain visual

## Token (satu sumber kebenaran)
- Warna, font, radius, shadow, z-index, dan breakpoint didefinisikan sekali
  di config Tailwind / `@theme` / CSS variables. Komponen hanya memakai token.
- Dilarang hex, `rgb()`, atau arbitrary value (`text-[#7c3aed]`, `w-[347px]`) di komponen.
- Spacing hanya dari skala Tailwind (kelipatan 4/8px).
- Palet: 1 netral + maksimal 1 aksen. Dilarang gradient ungu/biru/pink sebagai default.
- Dark mode: ikuti keputusan di `AGENTS.md`. Kalau ada, token dua set dan
  semua komponen dites di keduanya. Kalau tidak ada, jangan tambah setengah-setengah.
- Skala type tetap (5-6 ukuran), line-height jelas, lebar teks bacaan 60-75 karakter.
- Rasio gambar konsisten (`aspect-ratio`) dengan `object-fit` jelas.

## Font
- 1 display + 1 body via `next/font`, `display: swap`, subset yang dipakai,
  beberapa weight saja. Jangan Inter/Roboto default tanpa alasan.

## Bentuk
- Satu bahasa bentuk (tajam, sedikit rounded, atau pill). Jangan
  `rounded-2xl shadow-lg` di semua kartu.
- `backdrop-blur` hanya di header sticky yang menimpa konten. Selain itu dilarang.
- Dilarang: blob/orb gradient, grid pattern background, gradient text di heading,
  border-left berwarna sebagai dekorasi kartu, ring/glow di sekitar tombol dan
  kartu, ikon di lingkaran berwarna di atas setiap judul fitur.
- Dilarang badge "New"/"Beta" tanpa alasan nyata.

## Ikon
- Satu library (Lucide atau yang sudah ada), stroke seragam.
- Dilarang emoji sebagai ikon, ikon sparkle/bintang 4-sudut, status dot
  dekoratif di depan eyebrow, dan penomoran dekoratif (`01 /`, `Feature 01`).
  Nomor hanya untuk langkah berurutan sungguhan.

## Layout
- Mulai dari tujuan halaman dan konten, bukan template.
- Dilarang pola hero tengah + 3 kartu fitur + CTA + footer.
- Jangan center semuanya. Pakai hierarki, asimetri, whitespace yang disengaja.
- Mobile-first. Cek di 360px, 768px, 1280px.
- Gambar: screenshot asli, ilustrasi custom, atau tipografi. Dilarang
  placeholder AI generik atau stock yang kelihatan palsu.

## Animasi
- Harus punya fungsi: feedback, transisi state, atau arah perhatian.
- Dilarang fade-in-up di semua section, hover scale di semua kartu, animasi loop tanpa henti.
- Durasi 150-300ms, easing konsisten. Wajib hormati `prefers-reduced-motion`.
