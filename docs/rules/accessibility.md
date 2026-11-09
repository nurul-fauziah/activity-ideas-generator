# Aksesibilitas dan HTML semantik

## Semantik
- Landmark: satu `<main>`, plus `<header>`, `<nav>`, `<footer>`. `<nav>` diberi `aria-label` kalau lebih dari satu.
- `<article>` untuk konten mandiri, `<section>` hanya kalau punya heading, `<aside>` untuk pelengkap.
- Aksi = `<button>`. Navigasi = `<a>`/`next/link`. Dilarang `div`/`span` dengan `onClick`.
- Daftar pakai `<ul>/<ol>`, data tabular pakai `<table>` dengan `<th scope>`.
- `<time datetime>` untuk tanggal, `<figure>/<figcaption>` untuk gambar dengan keterangan.
- Skip link "Lewati ke konten utama" sebagai elemen fokus pertama.
- Heading berurutan, jangan pilih level heading demi ukuran font. Atur ukuran dengan class.

## Keyboard dan fokus
- Semua interaktif bisa dijangkau dan dioperasikan keyboard, urutan tab logis.
- Focus ring terlihat. Dilarang `outline: none` tanpa pengganti.
- Modal/dialog: focus trap, tutup dengan Esc, fokus kembali ke pemicu.
  Pakai elemen `<dialog>` atau library yang sudah ada di project.
- Target sentuh minimal 44x44px.

## Visual
- Kontras WCAG AA: 4.5:1 teks biasa, 3:1 teks besar dan komponen UI. Tes di
  light dan dark kalau ada dua tema.
- Jangan sampaikan informasi hanya lewat warna.
- `alt` bermakna untuk gambar informatif, `alt=""` untuk dekoratif.
- Hormati `prefers-reduced-motion`.

## Form
- `<label>` terhubung ke input (`htmlFor`/`id`). Input tidak hilang saat error.
- `type` dan `inputMode` sesuai (email, tel, url), `autocomplete` benar.
- Error inline per field, dihubungkan dengan `aria-describedby`.
  Status async diumumkan lewat `aria-live`.
- Tombol submit menampilkan status pending.

## Verifikasi
- Tes keyboard penuh, jalankan axe atau Lighthouse a11y, dan laporkan hasilnya.
