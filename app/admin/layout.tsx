import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel Misi — NgapainYuk",
  description: "Kelola, tambah, dan edit katalog misi gacha NgapainYuk secara visual.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-text" data-ui="admin-screen">
      {children}
    </div>
  );
}
