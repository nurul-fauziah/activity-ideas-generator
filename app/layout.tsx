import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { HUD } from "@/components/hud/hud";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ngapain-yuk.vercel.app"
  ),
  title: "NgapainYuk — Mesin Gacha Aktivitas Gratis & Arcade",
  description:
    "Putar mesin gacha kapsul, buka kapsul misteriusmu, dan dapatkan misi aktivitas seru 100% gratis dengan gamifikasi XP & level!",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NgapainYuk — Putar Mesin Gacha, Dapatkan Misi Gratis!",
    description:
      "Mesin gacha kapsul aktivitas seru tanpa biaya sepeserpun. Kumpulkan XP, jaga streak, dan lengkapi Kapsulpedia!",
    url: "/",
    siteName: "NgapainYuk",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NgapainYuk — Mesin Gacha Aktivitas Gratis",
    description:
      "Putar mesin gacha kapsul dan dapatkan misi aktivitas gratis seru!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen bg-arcade-grid flex flex-col pb-16 lg:pb-0">
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <ThemeProvider>
          <HUD />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
