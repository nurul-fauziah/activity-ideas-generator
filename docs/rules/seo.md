# SEO

## Dasar teknis
- `metadataBase` di root layout, URL absolut dari satu env (`NEXT_PUBLIC_SITE_URL`).
- `sitemap` dan `robots` wajib ada (file convention App Router; cek dokumentasi versi terpasang).
- `lang` di `<html>` sesuai bahasa konten. `hreflang` kalau multi-bahasa.
- Canonical per halaman (`alternates.canonical`), terutama kalau ada query param/filter/pagination.
- Halaman yang tidak boleh diindeks (admin, preview, hasil search internal)
  pakai `robots: { index: false }`.
- Favicon set lengkap (icon, apple-icon, manifest).

## Metadata per halaman
- Title unik, maksimal ~60 karakter. Description unik, ~150-160 karakter.
  Isi spesifik, bukan teks template.
- OG image spesifik per halaman, 1200x630 (`opengraph-image` atau file statis). Twitter card juga.

## Struktur konten
- Satu `<h1>` per halaman yang memuat topik utama. Heading berurutan, tidak loncat level.
- Slug deskriptif, huruf kecil, tanda hubung. URL lama di-redirect 301, bukan 404.
- Anchor text link deskriptif. Dilarang "klik di sini" dan "selengkapnya" tanpa konteks.
- Konten utama harus ada di HTML hasil render server, bukan baru muncul setelah JS client jalan.

## Structured data (JSON-LD)
- Sesuai jenis halaman: `Organization`, `LocalBusiness`, `Article`, `Product`,
  `BreadcrumbList`, `FAQPage`.
- Hanya untuk data yang benar-benar tampil di halaman. Wajib valid.
- Dilarang rating/review karangan di structured data.
