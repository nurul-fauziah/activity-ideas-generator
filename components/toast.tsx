import React, { useEffect } from "react";
import { Check, Info } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  type?: "success" | "info";
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="bg-surface border border-border shadow-e2 text-text px-5 py-3 rounded-pill flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-bottom-3 duration-200 pointer-events-auto">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === "info"
              ? "bg-primary text-primary-contrast"
              : "bg-success text-white"
          }`}
        >
          {toast.type === "info" ? <Info size={12} /> : <Check size={12} />}
        </div>
        <span>{toast.text}</span>
      </div>
    </div>
  );
}
