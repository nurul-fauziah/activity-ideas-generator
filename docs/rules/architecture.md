# Arsitektur

## Server vs client
- Default Server Component. `"use client"` hanya untuk state, effect, event
  handler, atau browser API, dan ditaruh serendah mungkin di tree
  (bukan di page/layout kecuali terpaksa).
- Data fetching di Server Component atau lapisan data server. Dilarang
  `useEffect` + `fetch` untuk data awal.
- Mutasi lewat Server Action atau Route Handler. Validasi input di server
  (zod atau yang sudah dipakai project), bukan cuma di client.
- Strategi cache/revalidate ditulis eksplisit per fetch. Default beda antar
  versi Next, jangan diandalkan.
- Perhatikan breaking change antar versi (contoh: `params`/`searchParams`
  bisa berupa Promise, API cache berubah, config Tailwind v4 berbasis CSS).
  Cek versi terpasang.

## Struktur folder
- Ikuti struktur yang sudah ada. Kalau project baru, organisasi per fitur:
  `app/(grup)/fitur/` berisi page, komponen, action, dan tipe fitur itu.
- Colocate: fungsi yang dipakai satu fitur tinggal di folder fitur itu.
  Dilarang `utils/`, `helpers/`, `services/` untuk fungsi yang dipakai satu tempat.
- Naik ke folder bersama (`components/ui`, `lib/`) hanya setelah dipakai di 2+ fitur.
- Komponen UI dasar (Button, Input, Card, dst.) dibuat sekali di `components/ui`.
  Dilarang membuat varian tombol baru per halaman. Tambah variant di komponen yang ada.

## Data dan tipe
- Satu lapisan akses data (query/ORM/API client). Komponen tidak memanggil
  database atau API eksternal langsung dari mana-mana.
- Tipe data dari server didefinisikan satu kali dan dipakai ulang.
  Skema validasi (zod) jadi sumber tipe kalau memungkinkan.
- Env divalidasi saat startup di satu file (`env.ts`). Sediakan `.env.example`.

## Error dan state
- Segment yang mengambil data wajib punya `loading.tsx`, `error.tsx`, dan
  `not-found.tsx`. `<Suspense>` dengan skeleton berbentuk mirip konten asli.
- Setiap UI berdata punya state: loading, empty, error, success, disabled.
- Error dari server action dikembalikan sebagai hasil terstruktur
  (field + pesan), bukan dilempar ke user mentah.
- Log error di server dengan konteks cukup. Dilarang `catch` kosong.

## Kode
- TypeScript strict. Dilarang `any`, `@ts-ignore`, dan `as` pemaksa tipe tanpa alasan.
- Komentar hanya untuk "kenapa". Nama variabel spesifik domain, bukan `data`, `item`, `temp`.
- Dilarang abstraksi spekulatif (interface, factory, wrapper, custom hook)
  untuk hal yang dipakai sekali.
- Dilarang `useMemo`/`useCallback`/`React.memo` tanpa masalah performa terukur.
- Dilarang `useEffect` untuk hal yang bisa dihitung saat render atau dikerjakan di event handler.
- Ikuti config Prettier/ESLint project. Jangan ubah config tanpa alasan.
- Test minimal untuk logika penting (validasi form, server action) kalau project sudah punya test runner.
