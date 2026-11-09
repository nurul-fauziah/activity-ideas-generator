# Keamanan dan privasi

- Secret hanya di env server. Dilarang prefix `NEXT_PUBLIC_` untuk key rahasia.
  `.env` tidak boleh di-commit. Sediakan `.env.example`.
- Security header di config Next: CSP yang masuk akal, `X-Content-Type-Options`,
  `Referrer-Policy`, `frame-ancestors`/`X-Frame-Options`, `Permissions-Policy`.
- Server Action dan Route Handler: cek autentikasi dan otorisasi di dalamnya.
  Menyembunyikan tombol di UI bukan proteksi.
- Validasi semua input di server. Jangan percaya data dari client.
- Form publik (kontak, login, daftar): rate limit + honeypot atau captcha.
- Dilarang `dangerouslySetInnerHTML` tanpa sanitasi.
- Link eksternal pakai `rel="noopener noreferrer"`.
- Jangan log data pribadi atau token.
- Kalau ada analytics/cookie non-esensial: sediakan consent dan halaman kebijakan privasi.
- Pesan error ke user tidak membocorkan detail internal (stack trace, query, path).
