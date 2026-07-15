import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Libre — Éditions Cypher",
  description:
    "Créez un CV professionnel, conforme aux normes ATS, gratuitement et sans compte. Projet open source.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
