import React from "react";
import { Sun, Moon, Bookmark } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  savedCount: number;
  onOpenSaved: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  savedCount,
  onOpenSaved,
}: HeaderProps) {
  return (
    <header className="w-full border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-primary text-primary-contrast flex items-center justify-center font-display font-extrabold text-xl shadow-xs">
            N
          </div>
          <div>
            <span className="font-display font-bold text-lg text-text tracking-tight block">
              NgapainYuk
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Saved Activities Button */}
          <Button
            variant="ghost"
            onClick={onOpenSaved}
            aria-label={`Buka ${savedCount} aktivitas tersimpan`}
            className="relative px-3 sm:px-4 h-10 text-sm font-semibold text-text gap-2 border border-border sm:border-transparent"
          >
            <Bookmark size={18} className="text-primary" />
            <span className="hidden sm:inline">Tersimpan</span>
            {savedCount > 0 ? (
              <span className="w-5 h-5 rounded-full bg-primary text-primary-contrast text-xs font-bold flex items-center justify-center">
                {savedCount}
              </span>
            ) : null}
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label={
              theme === "dark"
                ? "Ganti ke mode terang (light mode)"
                : "Ganti ke mode gelap (dark mode)"
            }
            className="text-text border border-border sm:border-transparent"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-warning" />
            ) : (
              <Moon size={20} className="text-primary" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
