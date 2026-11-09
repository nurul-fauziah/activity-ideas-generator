import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-2 border border-border flex items-center justify-center font-display font-extrabold text-2xl text-primary mb-4">
        404
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-text-muted text-base max-w-md mb-6">
        Halaman yang kamu tuju tidak ada atau tautan sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center font-semibold rounded-pill h-12 px-6 bg-primary text-primary-contrast hover:brightness-110 transition-all"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
