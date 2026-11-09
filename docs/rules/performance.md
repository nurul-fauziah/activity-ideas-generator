# Performa

Target (mobile): LCP < 2.5s, INP < 200ms, CLS < 0.1, Lighthouse 90+.

- Gambar pakai `next/image` dengan `width`/`height` atau `sizes` benar.
  Dilarang gambar tanpa dimensi (penyebab CLS).
- Gambar LCP (hero) pakai `priority` (atau padanannya di versi terpasang). Sisanya lazy.
- Font pakai `next/font`, `display: swap`, subset seperlunya, maksimal 2 family.
- Script pihak ketiga pakai `next/script` dengan strategy yang tepat.
- Dilarang import library besar untuk fungsi kecil. Komponen berat di bawah
  fold pakai `next/dynamic`.
- JS client seminimal mungkin: pindahkan logika ke Server Component.
- Cek ukuran bundle dengan analyzer kalau JS halaman mencurigakan.
- Caching/revalidate eksplisit per fetch.
- Hindari layout shift: sediakan ruang untuk konten async (skeleton, aspect-ratio).
