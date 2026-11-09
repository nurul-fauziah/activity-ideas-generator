"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for internal debugging
  }, [error]);

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 text-danger flex items-center justify-center font-bold text-2xl mb-4">
        !
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
        Terjadi Kendala Teknis
      </h1>
      <p className="text-text-muted text-base max-w-md mb-6">
        Halaman mengalami gangguan saat memproses aktivitas. Silakan coba muat ulang.
      </p>
      <Button variant="primary" onClick={() => reset()}>
        Coba Muat Ulang
      </Button>
    </div>
  );
}
